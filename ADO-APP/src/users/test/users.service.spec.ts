import { Repository } from "typeorm";
import { UsersService } from "../users.service"
import { User } from "../users.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "../dto/users.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { mockUser } from "src/mock-datas";

describe('UsersService', () => {
    let service: UsersService;
    let repo: Repository<User>;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn().mockReturnValue(mockUser),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        delete: jest.fn(),
                    }
                },
            ],
        }).compile();
        service = module.get<UsersService>(UsersService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('create()', () => {
        it('should create a user', async () => {
            const dto: CreateUserDto = {
                displayname: 'Maddy',
                email: 'maddy@gmail.com',
                password: 'password',
            };

            jest.spyOn(repo, 'create').mockReturnValue(mockUser as any);
            jest.spyOn(repo, 'save').mockResolvedValue(mockUser as any);

            const result = await service.create(dto);
            expect(repo.create).toHaveBeenCalledWith(dto);
            expect(repo.save).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUser);
        });
        it('it should throw ConflictException on duplicate', async () => {
            jest.spyOn(repo, 'save').mockRejectedValueOnce({ code: '23505' });
            await expect(service.create({} as any)).rejects.toThrow(ConflictException);
        });

        it('it should throw InternalServerErrorException on other errors', async () => {
            jest.spyOn(repo, 'save').mockRejectedValueOnce({ code: 'UNKNOWN' });
            await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOneById', () => {
        it('it should return one user by id', async () => {

            jest.spyOn(repo, 'findOneBy').mockResolvedValue(mockUser);
            const result = await service.findOneById(1);

            expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual(mockUser);
        });
    });


    describe('findOneByName', () => {
        it('it should return onse user by name', async () => {

            jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
            const result = await service.findOneByName('Maddy');

            expect(repo.findOne).toHaveBeenCalledWith
                ({ where: { displayname: 'Maddy' } });
            expect(result).toEqual(mockUser);
        });
    });


    describe('delete', () => {
        it('should delete the user', async () => {
            jest.spyOn(repo, 'findOneBy').mockResolvedValue(mockUser);
            await service.DeleteUser(1);
            expect(repo.delete).toHaveBeenCalledWith(1);
        });
    });



}); 
