import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/create-room-dto';
import { BuildingEntity } from '../entities/building.entity';
import { RoomTypeEntity } from '../entities/room-type.entity';

@Injectable()
export class RoomService {

    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepo: Repository<RoomEntity>,

        @InjectRepository(BuildingEntity)
        private readonly buildingRepo: Repository<BuildingEntity>,

        @InjectRepository(RoomTypeEntity)
        private readonly typeRepo: Repository<RoomTypeEntity>,
    ){}

    async getAll(): Promise<RoomEntity[]> {
        return await this.roomRepo.find({
            relations: {
                building: true,
                room_type: true,
            }
        });
    }

    async getAllIds(): Promise<number[]> {
        const records = await this.roomRepo.find({
            select: ["id"], // Solo selecciona el campo `id`
        });
        return records.map((record) => record.id);
    }

    async getById(id: number): Promise<RoomEntity> {
        return await this.roomRepo.findOne({
            where: {
                id: id
            },
            relations: {
                building: true,
                room_type: true,
            }
        })
    }

    async getCapacityById(id: number): Promise<number> {
        const result = await this.roomRepo
            .createQueryBuilder("room")
            .select("room.capacity")
            .where("room.id = :id", { id })
            .getRawOne();
        return result ? result.capacity : null;
    }

    async getIdsByCampusType(campus_id: number, type_id: number): Promise<number[]> {
        const result = await this.roomRepo
            .createQueryBuilder("room")
            .select("room.id")
            .innerJoin("room.building", "building")  // Realizamos JOIN con la tabla BuildingEntity
            .innerJoin("room.room_type", "room_type")  // Realizamos JOIN con la tabla RoomTypeEntity
            .where("building.campus = :campus_id", { campus_id })  // Filtramos por campus_id de la tabla BuildingEntity
            .andWhere("room.room_type = :type_id", { type_id })
            .getRawMany();
    
        return result.map(row => row.id);  // Extraemos solo los ids
    }
    
    async getIdsByType(type_id: number): Promise<number[]> {
        const result = await this.roomRepo
            .createQueryBuilder("room")
            .select("room.id")
            .where("room.room_type = :type_id", { type_id })
            .getRawMany();
    
        return result.map(row => row.id);  // Extraemos solo los ids
    }

    async createOne(newDto: CreateRoomDto): Promise<RoomEntity> {
        const buildingFound = await this.buildingRepo.findOne({
            where: {id: newDto.building_id}
        })
        if(!buildingFound){
            throw new Error('Building not found in creation of room');
        }
        const typeFound = await this.typeRepo.findOne({
            where: {id: newDto.type_id}
        })
        if(!typeFound){
            throw new Error('Room Type not found in creation of room');
        }

        const newEntity = new RoomEntity();
        newEntity.name = newDto.name;
        newEntity.capacity = newDto.capacity;
        newEntity.building = buildingFound;
        newEntity.room_type = typeFound;
        return await this.roomRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateRoomDto): Promise<RoomEntity> {
        const buildingFound = await this.buildingRepo.findOne({
            where: {id: updatedDto.building_id}
        })
        if(!buildingFound){
            throw new Error('Building not found in update of room');
        }
        const typeFound = await this.typeRepo.findOne({
            where: {id: updatedDto.type_id}
        })
        if(!typeFound){
            throw new Error('Room Type not found in update of room');
        }

        const entityFound = await this.roomRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        entityFound.capacity = updatedDto.capacity;
        entityFound.building = buildingFound;
        entityFound.room_type = typeFound;
        return await this.roomRepo.save(entityFound);
    }

    async createMany(newDtos: CreateRoomDto[]): Promise<RoomEntity[]> {
        const newEntities: RoomEntity[] = [];
        for(const newDto of newDtos){
            const buildingFound = await this.buildingRepo.findOne({
                where: {id: newDto.building_id}
            })
            if(!buildingFound){
                throw new Error('Building not found in bulk creation of room');
            }
            const typeFound = await this.typeRepo.findOne({
                where: {id: newDto.type_id}
            })
            if(!typeFound){
                throw new Error('Room Type not found in bulk creation of room');
            }
    
            const newEntity = new RoomEntity();
            newEntity.name = newDto.name;
            newEntity.capacity = newDto.capacity;
            newEntity.building = buildingFound;
            newEntity.room_type = typeFound;
            newEntities.push(newEntity);
        }
        return await this.roomRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.roomRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.roomRepo.delete(id);
    }

    async getSize(): Promise<number> {
        return await this.roomRepo.count();
    }
}
