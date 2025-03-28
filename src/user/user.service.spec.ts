import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';


const role: Role = 'user';
const roleAdmin: Role = 'admin';
const id: string = '517a5b66-d885-4847-aae0-8f26e5b1eb90';
const idAdmin: string = '517a5b66-d885-4847-aae0-8f26e5b1eb99';

// Mock bcrypt entirely
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}));


describe('UserService', () => {
    let userService: UserService;
    let prismaService: PrismaService;
    let bcrypt: any;
    let logger: Logger;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUniqueOrThrow: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
        bcrypt = require('bcryptjs');
        logger = new Logger('UserService');

        // Spy on the Logger methods
        jest.spyOn(logger, 'log').mockImplementation(() => { });
        jest.spyOn(logger, 'error').mockImplementation(() => { });
        jest.spyOn(logger, 'warn').mockImplementation(() => { });

        // Replace the private logger in UserService with the mocked one
        Object.defineProperty(userService, 'logger', { value: logger });

    });

    describe('create', () => {
        it('should create a new user successfully', async () => {
            const dto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                passwordconf: 'password123',
                image: null,
                role,
            };
            const hashedPassword = 'hashedPassword';

            (prismaService.user.create as jest.Mock).mockResolvedValue({
                id: '1',
                name: dto.name,
                email: dto.email.toLowerCase(),
                image: null,
                role: dto.role,
                createdAt: new Date(),
            });

            const result = await userService.create(dto);

            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    email: dto.email.toLowerCase(),
                    password: hashedPassword,
                    image: null,
                    role: dto.role,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                },
            });
            expect(result).toEqual({
                id: '1',
                name: dto.name,
                email: dto.email.toLowerCase(),
                image: null,
                role: dto.role,
                createdAt: expect.any(Date),
            });
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const dto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                passwordconf: 'wrongPassword',
                image: null,
                role,
            };

            await expect(userService.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user already exists', async () => {
            const dto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                passwordconf: 'password123',
                image: null,
                role,
            };

            (prismaService.user.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

            await expect(userService.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException if Prisma throws an unexpected error', async () => {
            const dto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                passwordconf: 'password123',
                image: null,
                role,
            };

            // Simulate an unexpected error from Prisma
            (prismaService.user.create as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

            await expect(userService.create(dto)).rejects.toThrow(InternalServerErrorException);

            // Ensure the error was logged
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('POST: error: Error: Unexpected database error'));
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id, name: 'John Doe', email: 'john.doe@example.com', role },
                { id: idAdmin, name: 'Jane Doe', email: 'jane.doe@example.com', role: roleAdmin },
            ];

            (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userService.findAll();

            expect(prismaService.user.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual(mockUsers);
        });

        it('should throw InternalServerErrorException if Prisma throws an unexpected error', async () => {
            // Simulate an unexpected error from Prisma
            (prismaService.user.findMany as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

            await expect(userService.findAll()).rejects.toThrow(InternalServerErrorException);

            // Ensure the error was logged
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('GET: error: Error: Unexpected database error'));
        });
    });

    describe('findOne', () => {
        it('should return a user by ID if authorized', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.findOne(field, value, mockUser);

            expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { id: value },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException if a non-admin user tries to access another user\'s data', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = idAdmin; // Different ID

            await expect(userService.findOne(field, value, mockUser)).rejects.toThrow(UnauthorizedException);
        });

        it('should allow an admin user to access any user\'s data', async () => {
            const mockUser = { id: idAdmin, name: 'Admin User', email: 'admin@example.com', role: roleAdmin };
            const field = 'id';
            const value = id; // Different ID
            const mockTargetUser = { id, name: 'Jane Doe', email: 'jane.doe@example.com', role };

            (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockTargetUser);

            const result = await userService.findOne(field, value, mockUser);

            expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { id: value },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual(mockTargetUser);
        });

        it('should throw BadRequestException if the user is not found', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: 'P2025' });

            await expect(userService.findOne(field, value, mockUser)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException if Prisma throws an unexpected error', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            // Simulate an unexpected error from Prisma
            (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

            await expect(userService.findOne(field, value, mockUser)).rejects.toThrow(InternalServerErrorException);

            // Ensure the error was logged
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('GET/{id}: error: Error: Unexpected database error'));
        });
    });

    describe('update', () => {
        it('should update a user\'s data if authorized', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;
            const dto: UpdateUserDto = {
                name: 'Updated Name',
                email: 'updated.email@example.com',
                password: 'newPassword123',
                passwordconf: 'newPassword123',
            };
            const hashedPassword = 'hashedPassword';

            (prismaService.user.update as jest.Mock).mockResolvedValue({
                ...mockUser,
                name: dto.name,
                email: dto.email.toLowerCase(),
            });

            const result = await userService.update(field, value, dto, mockUser);

            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: value },
                data: {
                    name: dto.name,
                    email: dto.email.toLowerCase(),
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual({
                ...mockUser,
                name: dto.name,
                email: dto.email.toLowerCase(),
            });
        });

        it('should throw UnauthorizedException if a non-admin user tries to update another user\'s data', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = idAdmin; // Different ID
            const dto: UpdateUserDto = { name: 'Updated Name' };

            await expect(userService.update(field, value, dto, mockUser)).rejects.toThrow(UnauthorizedException);
        });

        it('should allow an admin user to update any user\'s data', async () => {
            const mockUser = { id: idAdmin, name: 'Admin User', email: 'admin@example.com', role: roleAdmin };
            const field = 'id';
            const value = id; // Different ID
            const dto: UpdateUserDto = { name: 'Updated Name' };

            (prismaService.user.update as jest.Mock).mockResolvedValue({
                id: value,
                name: dto.name,
                email: 'target.user@example.com',
                role,
            });

            const result = await userService.update(field, value, dto, mockUser);

            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: value },
                data: { name: dto.name },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(result).toEqual({
                id: value,
                name: dto.name,
                email: 'target.user@example.com',
                role,
            });
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;
            const dto: UpdateUserDto = {
                password: 'newPassword123',
                passwordconf: 'wrongPassword',
            };

            await expect(userService.update(field, value, dto, mockUser)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException if Prisma throws an unexpected error', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;
            const dto = { name: 'Updated Name' };

            // Simulate an unexpected error from Prisma
            (prismaService.user.update as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

            await expect(userService.update(field, value, dto, mockUser)).rejects.toThrow(InternalServerErrorException);

            // Ensure the error was logged
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('PATCH: error: Error: Unexpected database error'));
        });
    });

    describe('remove', () => {
        it('should delete a user if authorized', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            (prismaService.user.delete as jest.Mock).mockResolvedValue({
                id: value,
                email: mockUser.email,
                name: mockUser.name,
            });

            const result = await userService.remove(field, value, mockUser);

            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: value },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            expect(result).toEqual({ message: 'User deleted' });
        });

        it('should throw UnauthorizedException if a non-admin user tries to delete another user', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = idAdmin; // Different ID

            await expect(userService.remove(field, value, mockUser)).rejects.toThrow(UnauthorizedException);
        });

        it('should allow an admin user to delete any user', async () => {
            const mockUser = { id: idAdmin, name: 'Admin User', email: 'admin@example.com', role: roleAdmin };
            const field = 'id';
            const value = id; // Different ID

            (prismaService.user.delete as jest.Mock).mockResolvedValue({
                id: value,
                email: 'target.user@example.com',
                name: 'Target User',
            });

            const result = await userService.remove(field, value, mockUser);

            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: value },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            expect(result).toEqual({ message: 'User deleted' });
        });

        it('should throw BadRequestException if the user to delete is not found', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            (prismaService.user.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

            await expect(userService.remove(field, value, mockUser)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException if Prisma throws an unexpected error', async () => {
            const mockUser = { id, name: 'John Doe', email: 'john.doe@example.com', role };
            const field = 'id';
            const value = id;

            // Simulate an unexpected error from Prisma
            (prismaService.user.delete as jest.Mock).mockRejectedValue(new Error('Unexpected database error'));

            await expect(userService.remove(field, value, mockUser)).rejects.toThrow(InternalServerErrorException);

            // Ensure the error was logged
            expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('DELETE: error: Error: Unexpected database error'));
        });
    });
});