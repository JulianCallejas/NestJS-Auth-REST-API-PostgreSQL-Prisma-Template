import { GetUser } from './get-user.decorator';
import { ExecutionContext } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

describe('GetUser Decorator', () => {
  // Create a mock execution context with user
  const createMockContext = (user: any): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        user
      })
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext);

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  it('should return the entire user when no data is provided', () => {
    const ctx = createMockContext(mockUser);
    const result = GetUser()(undefined, undefined, { 
      factory: (data, ctx) => ctx.switchToHttp().getRequest().user,
      data: undefined,
      ctx 
    });
    expect(result).toEqual(mockUser);
  });

  it('should return specific user property when string data is provided', () => {
    const ctx = createMockContext(mockUser);
    const result = GetUser('email')(undefined, undefined, {
      factory: (data, ctx) => {
        const user = ctx.switchToHttp().getRequest().user;
        return data ? user[data] : user;
      },
      data: 'email',
      ctx
    });
    expect(result).toBe('test@example.com');
  });

  it('should return subset of user properties when array data is provided', () => {
    const ctx = createMockContext(mockUser);
    const result = GetUser(['name', 'role'])(undefined, undefined, {
      factory: (data, ctx) => {
        const user = ctx.switchToHttp().getRequest().user;
        if (Array.isArray(data)) {
          return data.reduce((obj, key) => ({ ...obj, [key]: user[key] }), {});
        }
        return data ? user[data] : user;
      },
      data: ['name', 'role'],
      ctx
    });
    expect(result).toEqual({
      name: 'Test User',
      role: 'user'
    });
  });

  it('should throw InternalServerErrorException when user is missing', () => {
    const ctx = createMockContext(null);
    expect(() => GetUser()(undefined, undefined, {
      factory: (data, ctx) => {
        const user = ctx.switchToHttp().getRequest().user;
        if (!user) throw new InternalServerErrorException('Missed user');
        return user;
      },
      data: undefined,
      ctx
    })).toThrow(InternalServerErrorException);
  });

  it('should handle empty array input', () => {
    const ctx = createMockContext(mockUser);
    const result = GetUser([])(undefined, undefined, {
      factory: (data, ctx) => {
        const user = ctx.switchToHttp().getRequest().user;
        if (Array.isArray(data) && data.length === 0) return {};
        return user;
      },
      data: [],
      ctx
    });
    expect(result).toEqual({});
  });
});