import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampusEntity } from '../entities/campus.entity';
import { Repository } from 'typeorm';
import { CreateCampusDto } from '../dto/create-campus-dto';

@Injectable()
export class CampusService {

    constructor(
        @InjectRepository(CampusEntity)
        private readonly campusRepo: Repository<CampusEntity>,
    ){}

    async getAll(): Promise<CampusEntity[]> {
        return await this.campusRepo.find({
            relations: {
                buildings: true,
            }
        });
    }

    async getById(id: number): Promise<CampusEntity> {
        return await this.campusRepo.findOne({
            where: {
                id: id
            },
            relations: {
                buildings: true,
            }
        })
    }
    
    async getByName(name: string): Promise<CampusEntity> {
        return await this.campusRepo.findOne({
            where: {
                name: name
            },
        })
    }

    async createOne(newDto: CreateCampusDto): Promise<CampusEntity> {
        const newEntity = new CampusEntity();
        newEntity.name = newDto.name;
        return await this.campusRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateCampusDto): Promise<CampusEntity> {
        const entityFound = await this.campusRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        return await this.campusRepo.save(entityFound);
    }

    async createMany(newDtos: CreateCampusDto[]): Promise<CampusEntity[]> {
        const newEntities: CampusEntity[] = [];
        for(const newDto of newDtos){
            const newEntity = new CampusEntity();
            newEntity.name = newDto.name;
            newEntities.push(newEntity);
        }
        return await this.campusRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.campusRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.campusRepo.delete(id);
    }
}
