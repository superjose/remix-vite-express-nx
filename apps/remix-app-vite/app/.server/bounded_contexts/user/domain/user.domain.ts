import { AppUser, WorkflowUser, AnonymousUser } from './user.types';

export const ANONYMOUS_USER_ID = 'anonymous-user-id';
export const ANONYMOUS_TENANT_ID = 'anonymous-tenant-id';
export const WORKFLOW_TENANT_ID = 'workflow-tenant-id';

export class User {
  current: AppUser | WorkflowUser | AnonymousUser;
  private constructor(current: AppUser | WorkflowUser | AnonymousUser) {
    this.current = current;
  }

  static createAppUser(current: AppUser) {
    return new User(current);
  }

  static createWorkflowUser() {
    return new User({
      type: 'workflow-user',
      tenants: [
        {
          tenantId: WORKFLOW_TENANT_ID,
          name: 'workflow',
        },
      ],
    });
  }

  static createAnonymousUser() {
    return new User({
      type: 'anonymous',
      tenants: [
        {
          tenantId: ANONYMOUS_TENANT_ID,
          name: 'anonymous',
        },
      ],
      name: 'anonymous',
      userId: ANONYMOUS_USER_ID,
    });
  }

  get isAuthenticated(): boolean {
    return (
      this.current.type === 'user' || this.current.type === 'workflow-user'
    );
  }

  get tenantId(): string {
    switch (this.current.type) {
      case 'user':
        // TODO: return the proper tenant id
        return this.current.tenants[0]?.tenantId!;
      case 'workflow-user':
        return this.current.tenants[0]?.tenantId!;
      case 'anonymous':
        return this.current.tenants[0]?.tenantId!;
    }
  }
  get userId(): string {
    switch (this.current.type) {
      case 'user':
        return this.current.userId;
      case 'workflow-user':
        return 'workflow-user-id';
      case 'anonymous':
        return this.current.userId;
    }
  }
  get loginProvider(): string[] {
    switch (this.current.type) {
      case 'user':
        return this.current.loginProvider;
      case 'workflow-user': {
        return ['workflow'];
      }
      case 'anonymous':
        return ['anonymous'];
      default:
        return ['unspecified'];
    }
  }
}
