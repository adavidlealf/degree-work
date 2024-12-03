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
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;

    @ManyToOne(
        () => ProgramEntity,
        (program: ProgramEntity) => program.curriculums,
    {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'program_id'})
    program: ProgramEntity;
} 