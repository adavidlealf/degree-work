import { Injectable } from '@nestjs/common';
import { ImportCurriculumDto } from '../dto/import-curriculum-dto';
import { SubjectService } from 'src/curriculum/services/subject.service';
import { ProgramService } from 'src/curriculum/services/program.service';
import { CreateSubjectDto } from 'src/curriculum/dto/create-subject-dto';
import { CreateProgramDto } from 'src/curriculum/dto/create-program-dto';
import { CreateCurriculumDto } from 'src/curriculum/dto/create-curriculum-dto';
import { CurriculumService } from 'src/curriculum/services/curriculum.service';

@Injectable()
export class UploadService {

    constructor(
        private readonly currServ: CurriculumService,
        private readonly subjectServ: SubjectService,
        private readonly programServ: ProgramService,
    ){}

    hasNonWhitespaceCharacters(str: string): boolean {
        return str.trim().length > 0;
    }

    async generateCurriculum(data: any) {
        for(const fila of data) {
            if(fila.hasOwnProperty('subject_name') && 
            fila.hasOwnProperty('subject_code') &&
            fila.hasOwnProperty('program_name') &&
            fila.hasOwnProperty('curriculum_term')) {
                const dto = new ImportCurriculumDto();
                // Validaciones
                if(fila.curriculum_term>0){
                    dto.curriculum_term = fila.curriculum_term;
                } else {
                    throw new Error('fila.curriculum_term no puede ser negativo');
                }
                if(this.hasNonWhitespaceCharacters(fila.program_name)){
                    dto.program_name = fila.program_name;
                } else {
                    throw new Error('fila.program_name no puede ser vacio');
                }
                if(this.hasNonWhitespaceCharacters(fila.subject_code)){
                    dto.subject_code = fila.subject_code;
                } else {
                    throw new Error('fila.subject_code no puede ser vacio');
                }
                if(this.hasNonWhitespaceCharacters(fila.subject_name)){
                    dto.subject_name = fila.subject_name;
                } else {
                    dto.subject_name = dto.subject_code;
                }

                // Creacion subject
                let subjectFound = await this.subjectServ.getByCode(dto.subject_code);
                if(!subjectFound){
                    const dtoSubject: CreateSubjectDto = new CreateSubjectDto();
                    dtoSubject.name = dto.subject_name;
                    dtoSubject.code = dto.subject_code;
                    subjectFound = await this.subjectServ.createOne(dtoSubject);
                }
                // Creacion program
                let programFound = await this.programServ.getByName(dto.program_name);
                if(!programFound){
                    const dtoProgram: CreateProgramDto = new CreateProgramDto();
                    dtoProgram.name = dto.program_name;
                    programFound = await this.programServ.createOne(dtoProgram);
                }
                // Creacion curriculum
                const dtoCurr: CreateCurriculumDto = new CreateCurriculumDto();
                dtoCurr.program_id = programFound.id;
                dtoCurr.subject_id = subjectFound.id;
                dtoCurr.term = dto.curriculum_term;
                const currFound = await this.currServ.getBySubjectProgram(subjectFound.id, programFound.id);
                if(!currFound){
                    this.currServ.createOne(dtoCurr);
                } else if (currFound.term>dto.curriculum_term){
                    this.currServ.updateOne(currFound.id, dtoCurr);
                }
            } else {
                throw new Error('Curriculum no cuenta con las columnas requeridas');
            }
        }
        const currCount = await this.currServ.getSize();
        console.log(`Total registros curriculum: ${currCount}`);
        return currCount;
    }
}
