import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeacherCourseSessionEntity } from "./course-session-teacher.entity";

@Entity({name: 'course'})
export class CourseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nrc: number;

    @Column()
    group_name: string;

    @Column()
    group_size: number;

    @OneToMany(
        () => TeacherCourseSessionEntity,
        (teacher_sessions: TeacherCourseSessionEntity) => teacher_sessions.course
    )
    teacher_sessions: TeacherCourseSessionEntity[];
} 