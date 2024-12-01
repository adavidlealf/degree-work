import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CurriculumEntity } from "./curriculum.entity";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({name: 'subject'})
export class SubjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    code: string;

    @OneToMany(
        () => CurriculumEntity,
        (curriculums: CurriculumEntity) => curriculums.subject
    )
    curriculums: CurriculumEntity[];

    @OneToMany(
        () => SessionEntity,
        (sessions: SessionEntity) => sessions.subject
    )
    sessions: SessionEntity[];
}