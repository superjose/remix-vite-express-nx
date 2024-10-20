/**
 * This was taken and updated from the remix-utils repo.
 * The original code https://github.dev/sergiodxa/remix-utils
 */

import { Cookie } from '../../../types/remix.js'
import { getHeaders } from './get-headers.js'

export type CSRFErrorCode =
  | 'missing_token_in_cookie'
  | 'invalid_token_in_cookie'
  | 'tampered_token_in_cookie'
  | 'missing_token_in_body'
  | 'mismatched_token'

export class CSRFError extends Error {
  code: CSRFErrorCode
  constructor(code: CSRFErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'CSRFError'
  }
}

interface CSRFOptions {
  /**
   * The cookie object to use for serializing and parsing the CSRF token.
   */
  cookie: Cookie
  /**
   * The name of the form data key to use for the CSRF token.
   */
  formDataKey?: string
  /**
   * A secret to use for signing the CSRF token.
   */
  secret?: string
}

export class CSRF {
  private cookie: Cookie
  private formDataKey = 'csrf'
  private secret?: string
  private secretKey?: CryptoKey

  constructor(options: CSRFOptions) {
    this.cookie = options.cookie
    this.formDataKey = options.formDataKey ?? 'csrf'
    this.secret = options.secret
    if (this.secret) {
      this.importKey(this.secret)
    }
  }

  /**
   * Generates a random string in Base64URL to be used as an authenticity token
   * for CSRF protection.
   * @param bytes The number of bytes used to generate the token
   * @returns A random string in Base64URL
   */
  async generate(bytes = 32) {
    const tokenArray = new Uint8Array(bytes)
    crypto.getRandomValues(tokenArray)
    const token = this.arrayBufferToBase64Url(tokenArray)
    if (!this.secretKey) return token
    const signature = await this.sign(token)
    return [token, signature].join('.')
  }

  /**
   * Get the existing token from the cookie or generate a new one if it doesn't
   * exist.
   * @param requestOrHeaders A request or headers object from which we can
   * get the cookie to get the existing token.
   * @param bytes The number of bytes used to generate the token.
   * @returns The existing token if it exists in the cookie, otherwise a new
   * token.
   */
  async getToken(
    requestOrHeaders: Request | Headers = new Headers(),
    bytes = 32
  ) {
    const headers = getHeaders(requestOrHeaders)
    const existingToken = await this.cookie.parse(headers.get('cookie'))
    const token =
      typeof existingToken === 'string'
        ? existingToken
        : await this.generate(bytes)
    return token
  }

  /**
   * Generates a token and serialize it into the cookie.
   * @param requestOrHeaders A request or headers object from which we can
   * get the cookie to get the existing token.
   * @param bytes The number of bytes used to generate the token
   * @returns A tuple with the token and the string to send in Set-Cookie
   * If there's already a csrf value in the cookie then the token will
   * be the same and the cookie will be null.
   * @example
   * let [token, cookie] = await csrf.commitToken(request);
   * return json({ token }, {
   *   headers: { "set-cookie": cookie }
   * })
   */
  async commitToken(
    requestOrHeaders: Request | Headers = new Headers(),
    bytes = 32
  ) {
    const headers = getHeaders(requestOrHeaders)
    const existingToken = await this.cookie.parse(headers.get('cookie'))
    const token =
      typeof existingToken === 'string'
        ? existingToken
        : await this.generate(bytes)
    const cookie = existingToken ? null : await this.cookie.serialize(token)
    return [token, cookie] as const
  }

  /**
   * Verify if a request and cookie has a valid CSRF token.
   * @example
   * export async function action({ request }: ActionFunctionArgs) {
   *   await csrf.validate(request);
   *   // the request is authenticated and you can do anything here
   * }
   * @example
   * export async function action({ request }: ActionFunctionArgs) {
   *   let formData = await request.formData()
   *   await csrf.validate(formData, request.headers);
   *   // the request is authenticated and you can do anything here
   * }
   * @example
   * export async function action({ request }: ActionFunctionArgs) {
   *   let formData = await parseMultipartFormData(request);
   *   await csrf.validate(formData, request.headers);
   *   // the request is authenticated and you can do anything here
   * }
   */
  validate(data: Request): Promise<void>
  validate(data: FormData, headers: Headers): Promise<void>
  async validate(data: FormData | Request, headers?: Headers): Promise<void> {
    if (data instanceof Request && data.bodyUsed) {
      throw new Error(
        'The body of the request was read before calling CSRF#verify. Ensure you clone it before reading it.'
      )
    }

    const formData = await this.readBody(data)

    const cookie = await this.parseCookie(data, headers)

    // if the session doesn't have a csrf token, throw an error
    if (cookie === null) {
      throw new CSRFError(
        'missing_token_in_cookie',
        "Can't find CSRF token in cookie."
      )
    }

    if (typeof cookie !== 'string') {
      throw new CSRFError(
        'invalid_token_in_cookie',
        'Invalid CSRF token in cookie.'
      )
    }

    if (!(await this.verifySignature(cookie))) {
      throw new CSRFError(
        'tampered_token_in_cookie',
        'Tampered CSRF token in cookie.'
      )
    }

    // if the body doesn't have a csrf token, throw an error
    if (!formData.get(this.formDataKey)) {
      throw new CSRFError(
        'missing_token_in_body',
        "Can't find CSRF token in body."
      )
    }

    // if the body csrf token doesn't match the session csrf token, throw an
    // error
    if (formData.get(this.formDataKey) !== cookie) {
      throw new CSRFError(
        'mismatched_token',
        "Can't verify CSRF token authenticity."
      )
    }
  }

  private async readBody(data: FormData | Request) {
    if (data instanceof FormData) return data
    return await data.clone().formData()
  }

  private parseCookie(data: FormData | Request, headers?: Headers) {
    const _headers = data instanceof Request ? data.headers : headers
    if (!_headers) return null
    return this.cookie.parse(_headers.get('cookie'))
  }

  private async importKey(secret: string) {
    this.secretKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )
  }

  private async sign(token: string) {
    if (!this.secretKey) return token
    const signature = await crypto.subtle.sign(
      'HMAC',
      this.secretKey,
      new TextEncoder().encode(token)
    )
    return this.arrayBufferToBase64Url(new Uint8Array(signature))
  }

  private async verifySignature(token: string) {
    if (!this.secretKey) return true
    const [value, signature] = token.split('.')
    const expectedSignature = await this.sign(value)
    return signature === expectedSignature
  }

  private arrayBufferToBase64Url(buffer: Uint8Array) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}
