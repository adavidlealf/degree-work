import { SubjectEntity } from "src/curriculum/entities/subject.entity";
import { RoomTypeEntity } from "src/rooms/entities/room-type.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TeacherCourseSessionEntity } from "./course-session-teacher.entity";

@Entity({name: 'session'})
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timeslots: number;

    @ManyToOne(
        () => SubjectEntity,
        (subject: SubjectEntity) => subject.sessions,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;
    
    @ManyToOne(
        () => RoomTypeEntity,
        (room_type: RoomTypeEntity) => room_type.sessions,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'roomtype_id'})
    room_type: RoomTypeEntity;

    @OneToMany(
        () => TeacherCourseSessionEntity,
        (teacher_courses: TeacherCourseSessionEntity) => teacher_courses.session
    )
    teacher_courses: TeacherCourseSessionEntity[];
} 