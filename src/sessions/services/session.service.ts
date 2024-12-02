import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from '../dto/create-session-dto';
import { SubjectEntity } from 'src/curriculum/entities/subject.entity';
import { RoomTypeEntity } from 'src/rooms/entities/room-type.entity';

@Injectable()
export class SessionService {

    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionRepo: Repository<SessionEntity>,
        @InjectRepository(RoomTypeEntity)
        private readonly typeRepo: Repository<RoomTypeEntity>,
        @InjectRepository(SubjectEntity)
        private readonly subjectRepo: Repository<SubjectEntity>,
    ){}

    async getAll(): Promise<SessionEntity[]> {
        return await this.sessionRepo.find({
            relations: {
                subject: true,
                room_type: true,
                teacher_courses: true,
            }
        });
    }

    async getById(id: number): Promise<SessionEntity> {
        return await this.sessionRepo.findOne({
            where: {
                id: id
            },
            relations: {
                subject: true,
                room_type: true,
                teacher_courses: true,
            }
        })
    }

    async createOne(newDto: CreateSessionDto): Promise<SessionEntity> {
        const subjectFound = await this.subjectRepo.findOne({
            where: {id: newDto.subject_id}
        })
        if(!subjectFound){
            throw new Error('Subject not found in creation of session');
        }
        const typeFound = await this.typeRepo.findOne({
            where: {id: newDto.roomtype_id}
        })
        if(!typeFound){
            throw new Error('Room Type not found in creation of session');
        }
        const newEntity = new SessionEntity();
        newEntity.timeslots = newDto.timeslots;
        newEntity.subject = subjectFound;
        newEntity.room_type = typeFound;
        return await this.sessionRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateSessionDto): Promise<SessionEntity> {
        const subjectFound = await this.subjectRepo.findOne({
            where: {id: updatedDto.subject_id}
        })
        if(!subjectFound){
            throw new Error('Subject not found in update of session');
        }
        const typeFound = await this.typeRepo.findOne({
            where: {id: updatedDto.roomtype_id}
        })
        if(!typeFound){
            throw new Error('Room Type not found in update of session');
        }
        const entityFound = await this.sessionRepo.findOneBy({id:id});
        entityFound.timeslots = updatedDto.timeslots;
        entityFound.subject = subjectFound;
        entityFound.room_type = typeFound;
        return await this.sessionRepo.save(entityFound);
    }

    async createMany(newDtos: CreateSessionDto[]): Promise<SessionEntity[]> {
        const newEntities: SessionEntity[] = [];
        for(const newDto of newDtos){
            const subjectFound = await this.subjectRepo.findOne({
                where: {id: newDto.subject_id}
            })
            if(!subjectFound){
                throw new Error('Subject not found in bulk creation of session');
            }
            const typeFound = await this.typeRepo.findOne({
                where: {id: newDto.roomtype_id}
            })
            if(!typeFound){
                throw new Error('Room Type not found in bulk creation of session');
            }
            const newEntity = new SessionEntity();
            newEntity.timeslots = newDto.timeslots;
            newEntity.subject = subjectFound;
            newEntity.room_type = typeFound;
            newEntities.push(newEntity);
        }
        return await this.sessionRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.sessionRepo.clear();
    }
}
