import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherEntity } from '../entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from '../dto/create-teacher-dto';

@Injectable()
export class TeacherService {

    constructor(
        @InjectRepository(TeacherEntity)
        private readonly teacherRepo: Repository<TeacherEntity>,
    ){}

    async getAll(): Promise<TeacherEntity[]> {
        return await this.teacherRepo.find({
            relations: {
                course_sessions: true,
            }
        });
    }

    async getById(id: number): Promise<TeacherEntity> {
        return await this.teacherRepo.findOne({
            where: {
                id: id
            },
            relations: {
                course_sessions: true,
            }
        })
    }

    async getByName(name: string): Promise<TeacherEntity> {
        return await this.teacherRepo.findOne({
            where: {
                name: name
            },
        })
    }

    async createOne(newDto: CreateTeacherDto): Promise<TeacherEntity> {
        const newEntity = new TeacherEntity();
        newEntity.name = newDto.name;
        return await this.teacherRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateTeacherDto): Promise<TeacherEntity> {
        const entityFound = await this.teacherRepo.findOneBy({id:id});
        entityFound.name = updatedDto.name;
        return await this.teacherRepo.save(entityFound);
    }

    async createMany(newDtos: CreateTeacherDto[]): Promise<TeacherEntity[]> {
        const newEntities: TeacherEntity[] = [];
        for(const newDto of newDtos){
            const newEntity = new TeacherEntity();
            newEntity.name = newDto.name;
            newEntities.push(newEntity);
        }
        return await this.teacherRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.teacherRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.teacherRepo.delete(id);
    }
}
