import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CurriculumEntity } from "./curriculum.entity";

@Entity({name: 'program'})
export class ProgramEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        () => CurriculumEntity,
        (curriculums: CurriculumEntity) => curriculums.program
    )
    curriculums: CurriculumEntity[];
} 