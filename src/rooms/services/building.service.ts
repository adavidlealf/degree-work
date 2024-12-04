import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildingEntity } from '../entities/building.entity';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from '../dto/create-building-dto';
import { CampusEntity } from '../entities/campus.entity';

@Injectable()
export class BuildingService {

    constructor(
        @InjectRepository(BuildingEntity)
        private readonly buildingRepo: Repository<BuildingEntity>,
        
        @InjectRepository(CampusEntity)
        private readonly campusRepo: Repository<CampusEntity>,
    ){}

    async getAll(): Promise<BuildingEntity[]> {
        return await this.buildingRepo.find({
            relations: {
                campus: true,
                rooms: true,
            }
        });
    }

    async getById(id: number): Promise<BuildingEntity> {
        return await this.buildingRepo.findOne({
            where: {
                id: id
            },
            relations: {
                campus: true,
                rooms: true,
            }
        })
    }

    async getByName(name: string): Promise<BuildingEntity> {
        return await this.buildingRepo.findOne({
            where: {
                name: name
            },
        })
    }

    async createOne(newDto: CreateBuildingDto): Promise<BuildingEntity> {
        const campusFound = await this.campusRepo.findOne({
            where: {id: newDto.campus_id}
        })
        if(!campusFound){
            throw new Error('Campus not found in creation of building');
        }

        const newEntity = new BuildingEntity();
        newEntity.name = newDto.name;
        newEntity.campus = campusFound;
        return await this.buildingRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateBuildingDto): Promise<BuildingEntity> {
        const campusFound = await this.campusRepo.findOne({
            where: {id: updatedDto.campus_id}
        })
        if(!campusFound){
            throw new Error('Campus not found in update of building');
        }

        const entityFound = await this.buildingRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        entityFound.campus = campusFound;
        return await this.buildingRepo.save(entityFound);
    }

    async createMany(newDtos: CreateBuildingDto[]): Promise<BuildingEntity[]> {
        const newEntities: BuildingEntity[] = [];
        for(const newDto of newDtos){
            const campusFound = await this.campusRepo.findOne({
                where: {id: newDto.campus_id}
            })
            if(!campusFound){
                throw new Error('Campus not found in bulk creation of building');
            }
    
            const newEntity = new BuildingEntity();
            newEntity.name = newDto.name;
            newEntity.campus = campusFound;
            newEntities.push(newEntity);
        }
        return await this.buildingRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.buildingRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.buildingRepo.delete(id);
    }
}
