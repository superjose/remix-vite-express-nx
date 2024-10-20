export type AppUser = {
    userId: string;
    tenants: Tenant[];
    email?: string;
    loginProvider: ['email', 'google', 'github'];
    createdAt: Date;
    updatedAt: Date;
    session: AuthSession;
    type: 'user';
  };
  
  export type Tenant = {
    tenantId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'tenant';
  };
  