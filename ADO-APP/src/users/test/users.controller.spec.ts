import { Test } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { mockCreateUserDto } from "src/mock-datas/dto/mock.crate-user.dto";
import { mockUser } from "src/mock-datas";
import { mock } from "node:test";
import { CreateUserDto } from "../dto/users.dto";
import { BadRequestException } from "@nestjs/common";


describe('UsersController', () => {
    const mockUserService = {
        findOneByName: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        findOneById: jest.fn(),
        DeleteUser: jest.fn()
    }
    let controller: UsersController;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService, useValue: mockUserService
                }
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    describe('CreatesUser()', () => {
        it('it creates user', async () => {

            mockUserService.findOneByName.mockResolvedValue(null);
            mockUserService.create.mockReturnValue(mockUser);

            const result = await controller.create(mockCreateUserDto);

            expect(mockUserService.findOneByName).toHaveBeenCalledWith(mockCreateUserDto.displayname);
            expect(mockUserService.create).toHaveBeenCalledWith(mockCreateUserDto);
            expect(result).toEqual(mockUser);
        });
        it('should throw BadRequestException if display name already exists', async () => {
            const mockExistingUser: CreateUserDto = {
                displayname: "alen",
                email: "alen@gmail.com",
                password: "password"
            };

            mockUserService.findOneByName.mockResolvedValue(mockUser); // means user already exists
            mockUserService.create.mockImplementation(() => {
                throw new Error('Should not be called');
            });

            await expect(controller.create(mockExistingUser)).rejects.toThrow(BadRequestException);

            expect(mockUserService.findOneByName).toHaveBeenCalledWith(mockExistingUser.displayname);
        });

    });

    describe('findUser()', () => {
        it('find one user by id', async () => {
            mockUserService.findAll.mockResolvedValue([mockUser]);
            const result = await controller.findAll();

            expect(mockUserService.findAll).toHaveBeenCalledWith();
            expect(result).toEqual([mockUser]);
        });
        it('find all user', async () => {
            mockUserService.findOneById.mockResolvedValue(mockUser);
            const result = await controller.findOne(mockUser.id);
            expect(mockUserService.findOneById).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockUser);
        });
    });

    describe('deleteuser()', () => {
        it('delete an user by id', async () => {
            const mockStringResult = `User ${mockUser.id} has been deleted`;
            mockUserService.DeleteUser.mockResolvedValue(mockStringResult);

            const result = await controller.Delete(mockUser.id);

            expect(mockUserService.DeleteUser).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockStringResult);

        });
    });

});
