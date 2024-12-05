import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeacherCourseSessionEntity } from "../entities/teacher-course-session.entity";
import { Repository } from "typeorm";
import { CreateTeacherCourseSessionDto } from "../dto/create-teacher-course-session-dto";
import { TeacherEntity } from "../entities/teacher.entity";
import { CourseEntity } from "../entities/course.entity";
import { SessionEntity } from "../entities/session.entity";

@Injectable()
export class TeacherCourseSessionService {
    constructor(
        @InjectRepository(TeacherCourseSessionEntity)
        private readonly teacherCourseSessionRepo: Repository<TeacherCourseSessionEntity>,
        @InjectRepository(TeacherEntity)
        private readonly teacherRepo: Repository<TeacherEntity>,
        @InjectRepository(CourseEntity)
        private readonly courseRepo: Repository<CourseEntity>,
        @InjectRepository(SessionEntity)
        private readonly sessionRepo: Repository<SessionEntity>
    ) { }

    async getAll(): Promise<TeacherCourseSessionEntity[]> {
        return await this.teacherCourseSessionRepo.find({
            relations: {
                teacher: true,
                course: true,
                session: true,
            },
        });
    }

    async getAllIds(): Promise<number[]> {
        const records = await this.teacherCourseSessionRepo.find({
            select: ["id"], // Solo selecciona el campo `id`
        });
        return records.map((record) => record.id);
    }

    async getIdsByTeacher(teacher_id: number): Promise<number[]> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs") // Alias definido aquí
            .select("tcs.id", "id")
            .innerJoin("tcs.teacher", "teacher") // Relación con teacher
            .where("teacher.id = :teacher_id", { teacher_id }) // Filtro por teacher_id
            .getRawMany(); // Obtener resultados
        return result.map(row => row.id);
    }

    async getIdsByCourse(course_id: number): Promise<number[]> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs") // Alias definido aquí
            .select("tcs.id", "id")
            .innerJoin("tcs.course", "course") // Relación con course
            .where("course.id = :course_id", { course_id }) // Filtro por course_id
            .getRawMany(); // Obtener resultados
        return result.map(row => row.id);
    }

    async getIdsBySubject(subject_id: number): Promise<number[]> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs") // Alias para la tabla principal
            .select("tcs.id", "id") // Seleccionar únicamente el campo id
            .innerJoin("tcs.session", "session") // Relación con la tabla session
            .innerJoin("session.subject", "subject") // Relación con la tabla subject
            .where("subject.id = :subject_id", { subject_id }) // Filtro por subject_id
            .getRawMany(); // Recuperar datos como objetos planos

        return result.map(row => row.id); // Extraer los valores id
    }

    async getIdsByTimeslots(timeslots: number): Promise<number[]> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs") // Alias para la tabla principal
            .select("tcs.id", "id") // Seleccionar únicamente el campo id
            .innerJoin("tcs.session", "session") // Relación con la tabla session
            .where("session.timeslots = :timeslots", { timeslots }) // Filtro por timeslots
            .getRawMany(); // Recuperar datos como objetos planos

        return result.map(row => row.id); // Extraer los valores id
    }

    async getRoomTypeIdById(id: number): Promise<number | null> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs")  // Alias para TeacherCourseSessionEntity
            .innerJoin("tcs.session", "session")  // Unir con SessionEntity
            .innerJoin("session.room_type", "room_type")  // Unir con RoomTypeEntity
            .select("room_type.id", "room_type_id")  // Seleccionar solo el id de room_type
            .where("tcs.id = :id", { id })  // Filtrar por el ID de TeacherCourseSessionEntity
            .getRawOne();  // Obtener un solo registro con los campos seleccionados

        return result ? result.room_type_id : null;  // Retornar el id de room_type
    }

    async getGroupSizeIdById(id: number): Promise<number | null> {
        const result = await this.teacherCourseSessionRepo
            .createQueryBuilder("tcs")  // Alias para TeacherCourseSessionEntity
            .innerJoin("tcs.course", "course") 
            .select("course.group_size", "group_size")  // Seleccionar solo el id de room_type
            .where("tcs.id = :id", { id })  // Filtrar por el ID de TeacherCourseSessionEntity
            .getRawOne();  // Obtener un solo registro con los campos seleccionados

        return result ? result.group_size : null;  // Retornar el id de room_type
    }

    async getById(id: number): Promise<TeacherCourseSessionEntity> {
        return await this.teacherCourseSessionRepo.findOne({
            where: {
                id: id,
            },
            relations: {
                teacher: true,
                course: true,
                session: true,
            },
        });
    }

    async createOne(newDto: CreateTeacherCourseSessionDto): Promise<TeacherCourseSessionEntity> {
        const teacherFound = await this.teacherRepo.findOne({
            where: { id: newDto.teacher_id },
        });
        if (!teacherFound) {
            throw new Error(
                "Teacher not found in creation of teacher course session"
            );
        }
        const courseFound = await this.courseRepo.findOne({
            where: { id: newDto.course_id },
        });
        if (!courseFound) {
            throw new Error("Course not found in creation of teacher course session");
        }
        const sessionFound = await this.sessionRepo.findOne({
            where: { id: newDto.session_id },
        });
        if (!sessionFound) {
            throw new Error(
                "Session not found in creation of teacher course session"
            );
        }
        const newEntity = new TeacherCourseSessionEntity();
        newEntity.teacher = teacherFound;
        newEntity.course = courseFound;
        newEntity.session = sessionFound;
        return await this.teacherCourseSessionRepo.save(newEntity);
    }

    async updateOne(id: number, updatedDto: CreateTeacherCourseSessionDto): Promise<TeacherCourseSessionEntity> {
        const teacherFound = await this.teacherRepo.findOne({
            where: { id: updatedDto.teacher_id },
        });
        if (!teacherFound) {
            throw new Error("Teacher not found in update of teacher course session");
        }
        const courseFound = await this.courseRepo.findOne({
            where: { id: updatedDto.course_id },
        });
        if (!courseFound) {
            throw new Error("Course not found in update of teacher course session");
        }
        const sessionFound = await this.sessionRepo.findOne({
            where: { id: updatedDto.session_id },
        });
        if (!sessionFound) {
            throw new Error("Session not found in update of teacher course session");
        }
        const entityFound = await this.teacherCourseSessionRepo.findOneBy({
            id: id,
        });
        entityFound.teacher = teacherFound;
        entityFound.course = courseFound;
        entityFound.session = sessionFound;
        return await this.teacherCourseSessionRepo.save(entityFound);
    }

    async createMany(newDtos: CreateTeacherCourseSessionDto[]): Promise<TeacherCourseSessionEntity[]> {
        const newEntities: TeacherCourseSessionEntity[] = [];
        for (const newDto of newDtos) {
            const teacherFound = await this.teacherRepo.findOne({
                where: { id: newDto.teacher_id },
            });
            if (!teacherFound) {
                throw new Error(
                    "Teacher not found in bulk creation of teacher course session"
                );
            }
            const courseFound = await this.courseRepo.findOne({
                where: { id: newDto.course_id },
            });
            if (!courseFound) {
                throw new Error(
                    "Course not found in bulk creation of teacher course session"
                );
            }
            const sessionFound = await this.sessionRepo.findOne({
                where: { id: newDto.session_id },
            });
            if (!sessionFound) {
                throw new Error(
                    "Session not found in bulk creation of teacher course session"
                );
            }
            const newEntity = new TeacherCourseSessionEntity();
            newEntity.teacher = teacherFound;
            newEntity.course = courseFound;
            newEntity.session = sessionFound;
            newEntities.push(newEntity);
        }
        return await this.teacherCourseSessionRepo.save(newEntities);
    }

    async deleteAll(): Promise<void> {
        await this.teacherCourseSessionRepo.clear();
    }

    async deleteOne(id: number): Promise<any> {
        return await this.teacherCourseSessionRepo.delete(id);
    }

    async getSize(): Promise<number> {
        return await this.teacherCourseSessionRepo.count();
    }
}
