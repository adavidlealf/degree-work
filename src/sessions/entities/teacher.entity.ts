import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeacherCourseSessionEntity } from "./teacher-course-session.entity";

@Entity({name: 'teacher'})
export class TeacherEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        () => TeacherCourseSessionEntity,
        (course_sessions: TeacherCourseSessionEntity) => course_sessions.teacher
    )
    course_sessions: TeacherCourseSessionEntity[];
} 