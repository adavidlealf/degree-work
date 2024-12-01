import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubjectEntity } from "./subject.entity";
import { ProgramEntity } from "./program.entity";

@Entity({name: 'curriculum'})
export class CurriculumEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    term: number;

    @ManyToOne(
        () => SubjectEntity,
        (subject: SubjectEntity) => subject.curriculums,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;

    @ManyToOne(
        () => ProgramEntity,
        (program: ProgramEntity) => program.curriculums,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'program_id'})
    program: ProgramEntity;
} 