import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from '../dto/create-course-dto';

@Injectable()
export class CourseService {

    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepo: Repository<CourseEntity>,
    ) { }

    async getAll(): Promise<CourseEntity[]> {
        return await this.courseRepo.find({
            relations: {
                teacher_sessions: true,
            }
        });
    }

    async getAllIds(): Promise<number[]> {
        const records = await this.courseRepo.find({
            select: ['id'], // Solo selecciona el campo `id`
        });
        return records.map(record => record.id);
    }

    async getById(id: number): Promise<CourseEntity> {
        return await this.courseRepo.findOne({
            where: {
                id: id
            },
            relations: {
                teacher_sessions: true,
            }
        })
    }

    async getByNrc(nrc: number): Promise<CourseEntity> {
        return await this.courseRepo.findOne({
            where: {
                nrc: nrc
            },
        })
    }

    async createOne(newDto: CreateCourseDto): Promise<CourseEntity> {
        const entityFound = await this.courseRepo.findOneBy({ nrc: newDto.nrc });
        if (entityFound) {
            throw new Error('Course found with the same nrc in creation');
        }
        const newEntity = new CourseEntity();
        newEntity.group_name = newDto.group_name;
        newEntity.group_size = newDto.group_size;
        newEntity.nrc = newDto.nrc;
        return await this.courseRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateCourseDto): Promise<CourseEntity> {
        const entityFound = await this.courseRepo.findOneBy({ id: id });
        entityFound.group_name = updatedDto.group_name;
        entityFound.group_size = updatedDto.group_size;
        entityFound.nrc = updatedDto.nrc;
        return await this.courseRepo.save(entityFound);
    }

    async createMany(newDtos: CreateCourseDto[]): Promise<CourseEntity[]> {
        const newEntities: CourseEntity[] = [];
        for (const newDto of newDtos) {
            const entityFound = await this.courseRepo.findOneBy({ nrc: newDto.nrc });
            if (entityFound) {
                throw new Error('Course found with the same nrc in bulk creation');
            }
            const newEntity = new CourseEntity();
            newEntity.group_name = newDto.group_name;
            newEntity.group_size = newDto.group_size;
            newEntity.nrc = newDto.nrc;
            newEntities.push(newEntity);
        }
        return await this.courseRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.courseRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.courseRepo.delete(id);
    }
}
