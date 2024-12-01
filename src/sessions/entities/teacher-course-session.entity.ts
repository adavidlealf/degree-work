import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeacherEntity } from "./teacher.entity";
import { CourseEntity } from "./course.entity";
import { SessionEntity } from "./session.entity";

@Entity({name: 'teacher_course_session'})
export class TeacherCourseSessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => TeacherEntity,
        (teacher: TeacherEntity) => teacher.course_sessions,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'teacher_id'})
    teacher: TeacherEntity;

    @ManyToOne(
        () => CourseEntity,
        (course: CourseEntity) => course.teacher_sessions,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'course_id'})
    course: CourseEntity;

    @ManyToOne(
        () => SessionEntity,
        (session: SessionEntity) => session.teacher_courses,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'session_id'})
    session: SessionEntity;
} 