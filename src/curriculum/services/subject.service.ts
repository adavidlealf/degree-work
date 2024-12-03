import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from '../entities/subject.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from '../dto/create-subject-dto';

@Injectable()
export class SubjectService {

    constructor(
        @InjectRepository(SubjectEntity)
        private readonly subjectRepo: Repository<SubjectEntity>,
    ){}

    async getAll(): Promise<SubjectEntity[]> {
        return await this.subjectRepo.find({
            relations: {
                curriculums: true,
                sessions: true,
            }
        });
    }

    async getById(id: number): Promise<SubjectEntity> {
        return await this.subjectRepo.findOne({
            where: {
                id: id
            },
            relations: {
                curriculums: true,
                sessions: true,
            }
        })
    }

    async getByCode(code: string): Promise<SubjectEntity> {
        return await this.subjectRepo.findOne({
            where: {
                code: code
            }
        })
    }

    async getByName(name: string): Promise<SubjectEntity> {
        return await this.subjectRepo.findOne({
            where: {
                name: name
            }
        })
    }

    async createOne(newDto: CreateSubjectDto): Promise<SubjectEntity> {
        const newEntity = new SubjectEntity();
        newEntity.name = newDto.name;
        newEntity.code = newDto.code;
        return await this.subjectRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateSubjectDto): Promise<SubjectEntity> {
        const entityFound = await this.subjectRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        entityFound.code = entityFound.code;
        return await this.subjectRepo.save(entityFound);
    }

    async createMany(newDtos: CreateSubjectDto[]): Promise<SubjectEntity[]> {
        const newEntities: SubjectEntity[] = [];
        for(const newDto of newDtos){
            const newEntity = new SubjectEntity();
            newEntity.name = newDto.name;
            newEntity.code = newDto.code;
            newEntities.push(newEntity);
        }
        return await this.subjectRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.subjectRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.subjectRepo.delete(id);
    }
}
