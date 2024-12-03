import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramEntity } from '../entities/program.entity';
import { Repository } from 'typeorm';
import { CreateProgramDto } from '../dto/create-program-dto';

@Injectable()
export class ProgramService {

    constructor(
        @InjectRepository(ProgramEntity)
        private readonly programRepo: Repository<ProgramEntity>,
    ){}

    async getAll(): Promise<ProgramEntity[]> {
        return await this.programRepo.find({
            relations: {
                curriculums: true,
            }
        });
    }

    async getById(id: number): Promise<ProgramEntity> {
        return await this.programRepo.findOne({
            where: {
                id: id
            },
            relations: {
                curriculums: true,
            }
        })
    }

    async getByName(name: string): Promise<ProgramEntity> {
        return await this.programRepo.findOne({
            where: {
                name: name
            }
        })
    }

    async createOne(newDto: CreateProgramDto): Promise<ProgramEntity> {
        const newEntity = new ProgramEntity();
        newEntity.name = newDto.name;
        return await this.programRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateProgramDto): Promise<ProgramEntity> {
        const entityFound = await this.programRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        return await this.programRepo.save(entityFound);
    }

    async createMany(newDtos: CreateProgramDto[]): Promise<ProgramEntity[]> {
        const newEntities: ProgramEntity[] = [];
        for(const newDto of newDtos){
            const newEntity = new ProgramEntity();
            newEntity.name = newDto.name;
            newEntities.push(newEntity);
        }
        return await this.programRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.programRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.programRepo.delete(id);
    }
}
