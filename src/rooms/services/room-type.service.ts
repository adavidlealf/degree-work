import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomTypeEntity } from '../entities/room-type.entity';
import { Repository } from 'typeorm';
import { CreateRoomTypeDto } from '../dto/create-room-type-dto';

@Injectable()
export class RoomTypeService {

    constructor(
        @InjectRepository(RoomTypeEntity)
        private readonly roomTypeRepo: Repository<RoomTypeEntity>,
    ) { }

    async getAll(): Promise<RoomTypeEntity[]> {
        return await this.roomTypeRepo.find({
            relations: {
                rooms: true,
                sessions: true,
            }
        });
    }

    async getAllIds(): Promise<number[]> {
        const records = await this.roomTypeRepo.find({
            select: ["id"], // Solo selecciona el campo `id`
        });
        return records.map((record) => record.id);
    }

    async getAllMaxOccupPerc(): Promise<number[]> {
        const records = await this.roomTypeRepo.find({
            select: ["max_occup_perc"], // Solo selecciona el campo `max_occup_perc`
        });
        return records.map((record) => record.max_occup_perc);
    }

    async getMaxOccupPercById(id: number): Promise<number | null> {
        const result = await this.roomTypeRepo
            .createQueryBuilder("room_type")
            .select("room_type.max_occup_perc")
            .where("room_type.id = :id", { id })
            .getRawOne();
    
        return result ? result.max_occup_perc : null; // Si se encuentra el resultado, devuelve el valor; si no, retorna null
    }
    

    async getById(id: number): Promise<RoomTypeEntity> {
        return await this.roomTypeRepo.findOne({
            where: {
                id: id
            },
            relations: {
                rooms: true,
                sessions: true,
            }
        })
    }

    async getByName(name: string): Promise<RoomTypeEntity> {
        return await this.roomTypeRepo.findOne({
            where: {
                name: name
            }
        })
    }

    async createOne(newDto: CreateRoomTypeDto): Promise<RoomTypeEntity> {
        const newEntity = new RoomTypeEntity();
        newEntity.name = newDto.name;
        newEntity.max_occup_perc = newDto.max_occup_perc;
        return await this.roomTypeRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateRoomTypeDto): Promise<RoomTypeEntity> {
        const entityFound = await this.roomTypeRepo.findOneBy({ id: id });
        entityFound.name = updatedDto.name;
        entityFound.max_occup_perc = entityFound.max_occup_perc;
        return await this.roomTypeRepo.save(entityFound);
    }

    async createMany(newDtos: CreateRoomTypeDto[]): Promise<RoomTypeEntity[]> {
        const newEntities: RoomTypeEntity[] = [];
        for (const newDto of newDtos) {
            const newEntity = new RoomTypeEntity();
            newEntity.name = newDto.name;
            newEntity.max_occup_perc = newDto.max_occup_perc;
            newEntities.push(newEntity);
        }
        return await this.roomTypeRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.roomTypeRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.roomTypeRepo.delete(id);
    }

    async getSize(): Promise<number> {
        return await this.roomTypeRepo.count();
    }
}
