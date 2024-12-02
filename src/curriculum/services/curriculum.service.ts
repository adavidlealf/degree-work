import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurriculumEntity } from '../entities/curriculum.entity';
import { Repository } from 'typeorm';
import { CreateCurriculumDto } from '../dto/create-curriculum-dto';
import { SubjectEntity } from '../entities/subject.entity';
import { ProgramEntity } from '../entities/program.entity';

@Injectable()
export class CurriculumService {

    constructor(
        @InjectRepository(CurriculumEntity)
        private readonly curriculumRepo: Repository<CurriculumEntity>,
        @InjectRepository(SubjectEntity)
        private readonly subjectRepo: Repository<SubjectEntity>,
        @InjectRepository(ProgramEntity)
        private readonly programRepo: Repository<ProgramEntity>,
    ){}

    async getAll(): Promise<CurriculumEntity[]> {
        return await this.curriculumRepo.find({
            relations: {
                subject: true,
                program: true,
            }
        });
    }

    async getById(id: number): Promise<CurriculumEntity> {
        return await this.curriculumRepo.findOne({
            where: {
                id: id
            },
            relations: {
                subject: true,
                program: true,
            }
        })
    }

    async createOne(newDto: CreateCurriculumDto): Promise<CurriculumEntity> {
        const subjectFound = await this.subjectRepo.findOne({
            where: {id: newDto.subject_id}
        })
        if(!subjectFound){
            throw new Error('Subject not found in creation of curriculum');
        }
        const programFound = await this.programRepo.findOne({
            where: {id: newDto.program_id}
        })
        if(!subjectFound){
            throw new Error('Program not found in creation of curriculum');
        }

        const newEntity = new CurriculumEntity();
        newEntity.term = newDto.term;
        newEntity.subject = subjectFound;
        newEntity.program = programFound;
        return await this.curriculumRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateCurriculumDto): Promise<CurriculumEntity> {
        const subjectFound = await this.subjectRepo.findOne({
            where: {id: updatedDto.subject_id}
        })
        if(!subjectFound){
            throw new Error('Subject not found in update of curriculum');
        }
        const programFound = await this.programRepo.findOne({
            where: {id: updatedDto.program_id}
        })
        if(!subjectFound){
            throw new Error('Program not found in update of curriculum');
        }
        const entityFound = await this.curriculumRepo.findOneBy({id:id});
        entityFound.term = updatedDto.term;
        entityFound.subject = subjectFound;
        entityFound.program = programFound;
        return await this.curriculumRepo.save(entityFound);
    }

    async createMany(newDtos: CreateCurriculumDto[]): Promise<CurriculumEntity[]> {
        const newEntities: CurriculumEntity[] = [];
        for(const newDto of newDtos){
            const subjectFound = await this.subjectRepo.findOne({
                where: {id: newDto.subject_id}
            })
            if(!subjectFound){
                throw new Error('Subject not found in bulk creation of curriculum');
            }
            const programFound = await this.programRepo.findOne({
                where: {id: newDto.program_id}
            })
            if(!subjectFound){
                throw new Error('Program not found in bulk creation of curriculum');
            }
    
            const newEntity = new CurriculumEntity();
            newEntity.term = newDto.term;
            newEntity.subject = subjectFound;
            newEntity.program = programFound;
            newEntities.push(newEntity);
        }
        return await this.curriculumRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.curriculumRepo.clear();
    }
}
