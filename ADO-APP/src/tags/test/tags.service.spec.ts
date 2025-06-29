import { Test } from "@nestjs/testing"
import { Tags } from "../tag.entity"
import { TagService } from "../tag.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { mockTag } from "../../mock-datas/data/mock.tag.data"
import { mockTagDto } from "../../mock-datas/dto/mock.tag.dto"

describe('TagService', () => {
    let service: TagService;
    let repo: Repository<Tags>;


    const mockTagRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOneBy: jest.fn(),
        delete: jest.fn(),
        findBy: jest.fn()
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TagService,
                {
                    provide: getRepositoryToken(Tags),
                    useValue: mockTagRepo,
                }
            ]
        }).compile();

        service = module.get<TagService>(TagService);
        repo = module.get<Repository<Tags>>(getRepositoryToken(Tags));

    });

    it('it creates tag', async () => {
        mockTagRepo.create.mockReturnValue(mockTag);
        mockTagRepo.save.mockResolvedValue(mockTag);

        const result = await service.createTag(mockTagDto);

        expect(mockTagRepo.create).toHaveBeenCalledWith(mockTagDto);
        expect(mockTagRepo.save).toHaveBeenCalledWith(mockTag);

        expect(result).toEqual(mockTag);
    });

    it('it delete a tag', async () => {
        mockTagRepo.findOneBy.mockResolvedValue({ id: mockTag.id });
        mockTagRepo.delete.mockResolvedValue(mockTag.id);

        const result = await service.deleteTag(mockTag.id);

        expect(mockTagRepo.findOneBy).toHaveBeenCalledWith({ id: mockTag.id });
        expect(mockTagRepo.delete).toHaveBeenCalledWith(mockTag.id);

        expect(result).toEqual(`Tag ${mockTag.id} is deleted`);
    });
});
