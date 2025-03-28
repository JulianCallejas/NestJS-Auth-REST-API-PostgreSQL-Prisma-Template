import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

const role: Role = 'user';
const roleAdmin: Role = 'admin';
const id: string = '517a5b66-d885-4847-aae0-8f26e5b1eb90';
const idAdmin: string = '517a5b66-d885-4847-aae0-8f26e5b1eb99';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call userService.create with correct DTO', async () => {
      const mockDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordconf: 'password123',
        image: null,
        role,
      };
      const mockResult = {
        id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        image: null,
        role,
        createdAt: new Date(),
      };

      // Mock the resolved value of userService.create
      (userService.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.create(mockDto);

      expect(userService.create).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call userService.findAll and return users', async () => {
      const mockUsers = [
        { id, name: 'John Doe', email: 'john.doe@example.com', role },
        { id: idAdmin, name: 'Jane Doe', email: 'jane.doe@example.com', role: roleAdmin },
      ];

      // Mock the resolved value of userService.findAll
      (userService.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with correct parameters', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
      const mockResult = mockUser;

      // Mock the resolved value of userService.findOne
      (userService.findOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findOne(id, mockUser);

      expect(userService.findOne).toHaveBeenCalledWith('id', id, mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneByEmail', () => {
    it('should call userService.findOne with correct parameters for email', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
      const mockResult = mockUser;
      // Mock the resolved value of userService.findOne
      (userService.findOne as jest.Mock).mockResolvedValue(mockResult);
  
      const email = 'john.doe@example.com';
      const result = await controller.findOneByEmail(email, mockUser);
  
      expect(userService.findOne).toHaveBeenCalledWith('email', email, mockUser);
      expect(result).toEqual(mockResult);
    });
  });
  

  describe('update', () => {
    it('should call userService.update with correct parameters', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
      const mockDto = { name: 'Updated Name' };
      const mockResult = { ...mockUser, name: 'Updated Name' };

      // Mock the resolved value of userService.update
      (userService.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.update(id, mockDto, mockUser);

      expect(userService.update).toHaveBeenCalledWith('id', id, mockDto, mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateByEmail', () => {
    it('should call userService.update with correct parameters for email', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
      const mockDto = { name: 'Updated Name' };
      const mockResult = { ...mockUser, name: 'Updated Name' };
  
      // Mock the resolved value of userService.update
      (userService.update as jest.Mock).mockResolvedValue(mockResult);
  
      const email = 'john.doe@example.com';
      const result = await controller.updateByEmail(email, mockDto, mockUser);
  
      expect(userService.update).toHaveBeenCalledWith('email', email, mockDto, mockUser);
      expect(result).toEqual(mockResult);
    });
  });
  

  describe('remove', () => {
    it('should call userService.remove with correct parameters', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role};
      const mockResult = { message: 'User deleted' };

      // Mock the resolved value of userService.remove
      (userService.remove as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.remove(id, mockUser);

      expect(userService.remove).toHaveBeenCalledWith('id', id, mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeByEmail', () => {
    it('should call userService.remove with correct parameters for email', async () => {
      const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
      const mockResult = { message: 'User deleted' };
  
      // Mock the resolved value of userService.remove
      (userService.remove as jest.Mock).mockResolvedValue(mockResult);
  
      const email = 'john.doe@example.com';
      const result = await controller.removeByEmail(email, mockUser);
  
      expect(userService.remove).toHaveBeenCalledWith('email', email, mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  
});