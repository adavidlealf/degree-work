import { Injectable } from '@nestjs/common';
import { ImportCurriculumDto } from '../dto/import-curriculum-dto';
import { SubjectService } from 'src/curriculum/services/subject.service';
import { ProgramService } from 'src/curriculum/services/program.service';
import { CreateSubjectDto } from 'src/curriculum/dto/create-subject-dto';
import { CreateProgramDto } from 'src/curriculum/dto/create-program-dto';
import { CreateCurriculumDto } from 'src/curriculum/dto/create-curriculum-dto';
import { CurriculumService } from 'src/curriculum/services/curriculum.service';
import { LogGateway } from '../gateway/log.gateway';
import { ImportSessionDto } from '../dto/import-session-dto';
import { RoomTypeService } from 'src/rooms/services/room-type.service';
import { CreateRoomTypeDto } from 'src/rooms/dto/create-room-type-dto';
import { TeacherService } from 'src/sessions/services/teacher.service';
import { CourseService } from 'src/sessions/services/course.service';
import { CreateTeacherDto } from 'src/sessions/dto/create-teacher-dto';
import { CreateCourseDto } from 'src/sessions/dto/create-course-dto';
import { SessionService } from 'src/sessions/services/session.service';
import { CreateSessionDto } from 'src/sessions/dto/create-session-dto';
import { CreateTeacherCourseSessionDto } from 'src/sessions/dto/create-teacher-course-session-dto';
import { TeacherCourseSessionService } from 'src/sessions/services/teacher-course-session.service';
import { ImportRoomDto } from '../dto/import-room-dto';
import { CampusService } from 'src/rooms/services/campus.service';
import { CreateCampusDto } from 'src/rooms/dto/create-campus-dto';
import { BuildingService } from 'src/rooms/services/building.service';
import { CreateBuildingDto } from 'src/rooms/dto/create-building-dto';
import { CreateRoomDto } from 'src/rooms/dto/create-room-dto';
import { RoomService } from 'src/rooms/services/room.service';

@Injectable()
export class UploadService {

    constructor(
        private readonly currServ: CurriculumService,
        private readonly subjectServ: SubjectService,
        private readonly programServ: ProgramService,
        private readonly roomServ: RoomService,
        private readonly roomTypeServ: RoomTypeService,
        private readonly teacherServ: TeacherService,
        private readonly courseServ: CourseService,
        private readonly sessionServ: SessionService,
        private readonly tcsServ: TeacherCourseSessionService,
        private readonly campusServ: CampusService,
        private readonly buildingServ: BuildingService,
        private readonly logGateway: LogGateway,
    ){}

    hasNonWhitespaceCharacters(str: string): boolean {
        return str.trim().length > 0;
    }

    async generateCurriculum(data: any): Promise<number> {
        let indice: number = 1;
        const decima: number = Math.floor(data.length/10);
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
                if(indice%decima===0){
                    this.logGateway.sendLog(`Filas procesadas: ${indice} de ${data.length}`);
                    this.logGateway.sendProgress((indice/(data.length))*100);
                }
            } else {
                this.logGateway.sendLog('Curriculum no cuenta con las columnas requeridas');
                throw new Error('Curriculum no cuenta con las columnas requeridas');
            }
            indice += 1;
        }
        this.logGateway.sendLog('Proceso de curriculums completado');
        this.logGateway.sendProgress(100);
        const currCount = await this.currServ.getSize();
        console.log(`Total registros curriculum: ${currCount}`);
        this.logGateway.sendLog(`Total registros curriculum: ${currCount}`);
        return currCount;
    }

    async generateSessions(data: any): Promise<number> {
        const def_max_occup_perc: number = 0.8;
        let indice: number = 1;
        const decima: number = Math.floor(data.length/10);
        for(const fila of data) {
            if(fila.hasOwnProperty('subject_code') && 
            fila.hasOwnProperty('roomtype_name') &&
            fila.hasOwnProperty('timeslots') &&
            fila.hasOwnProperty('teacher_name') &&
            fila.hasOwnProperty('group_size') &&
            fila.hasOwnProperty('nrc')) {
                const dto = new ImportSessionDto();
                // Validaciones
                if(this.hasNonWhitespaceCharacters(fila.subject_code)){
                    dto.subject_code = fila.subject_code;
                } else {
                    throw new Error('fila.subject_code no puede ser vacio');
                }
                if(this.hasNonWhitespaceCharacters(fila.roomtype_name)){
                    dto.roomtype_name = fila.roomtype_name;
                } else {
                    throw new Error('fila.roomtype_name no puede ser vacio');
                }
                if(fila.timeslots==1 || fila.timeslots==2){
                    dto.timeslots = fila.timeslots;
                } else {
                    throw new Error('fila.timeslots no puede ser diferente de 1 o 2');
                }
                if(this.hasNonWhitespaceCharacters(fila.teacher_name)){
                    dto.teacher_name = fila.teacher_name;
                } else {
                    throw new Error('fila.teacher_name no puede ser vacio');
                }
                if(fila.group_size>0){
                    dto.group_size = fila.group_size;
                } else {
                    throw new Error('fila.group_size debe ser mayor que 0');
                }
                if(fila.nrc>0){
                    dto.nrc = fila.group_size;
                } else {
                    throw new Error('fila.group_size debe ser mayor que 0');
                }
                if(fila.hasOwnProperty('group_name') &&
                    this.hasNonWhitespaceCharacters(fila.group_name)){
                    dto.group_name = fila.group_name;
                } else {
                    dto.group_name = indice.toString();
                }

                // Creacion subject
                let subjectFound = await this.subjectServ.getByCode(dto.subject_code);
                if(!subjectFound){
                    const dtoSubject: CreateSubjectDto = new CreateSubjectDto();
                    dtoSubject.name = dto.subject_code;
                    dtoSubject.code = dto.subject_code;
                    subjectFound = await this.subjectServ.createOne(dtoSubject);
                }
                // Creacion roomtype
                let roomtTypeFound = await this.roomTypeServ.getByName(dto.roomtype_name);
                if(!roomtTypeFound){
                    const dtoRoomType: CreateRoomTypeDto = new CreateRoomTypeDto();
                    dtoRoomType.name = dto.roomtype_name;
                    dtoRoomType.max_occup_perc = def_max_occup_perc;
                    roomtTypeFound = await this.roomTypeServ.createOne(dtoRoomType);
                }

                // Creacion teacher
                let teacherFound = await this.teacherServ.getByName(dto.teacher_name);
                if(!teacherFound){
                    const dtoTeacher: CreateTeacherDto = new CreateTeacherDto();
                    dtoTeacher.name = dto.teacher_name;
                    teacherFound = await this.teacherServ.createOne(dtoTeacher);
                }

                // Creacion course
                let courseFound = await this.courseServ.getByNrc(dto.nrc);
                if(!courseFound){
                    const dtoCourse: CreateCourseDto = new CreateCourseDto();
                    dtoCourse.group_name = dto.group_name;
                    dtoCourse.group_size = dto.group_size;
                    dtoCourse.nrc = dto.nrc;
                    courseFound = await this.courseServ.createOne(dtoCourse);
                }

                // Create Session
                const dtoSession: CreateSessionDto = new CreateSessionDto();
                dtoSession.roomtype_id = roomtTypeFound.id;
                dtoSession.subject_id = subjectFound.id;
                dtoSession.timeslots = dto.timeslots;
                const sessionCreated = await this.sessionServ.createOne(dtoSession);

                // Create teacher - course - session
                const dtoTeacherCourseSession: CreateTeacherCourseSessionDto = new CreateTeacherCourseSessionDto();
                dtoTeacherCourseSession.course_id = courseFound.id;
                dtoTeacherCourseSession.teacher_id = teacherFound.id;
                dtoTeacherCourseSession.session_id = sessionCreated.id;
                this.tcsServ.createOne(dtoTeacherCourseSession)
                .then(() => {
                    if(indice%decima===0){
                        this.logGateway.sendLog(`Filas procesadas: ${indice} de ${data.length}`);
                        this.logGateway.sendProgress((indice/(data.length))*100);
                    }
                });
            } else {
                this.logGateway.sendLog('Session no cuenta con las columnas requeridas');
                throw new Error('Session no cuenta con las columnas requeridas');
            }
            indice += 1;
        }
        this.logGateway.sendLog('Proceso de sesiones completado');
        this.logGateway.sendProgress(100);
        const tcsCount = await this.tcsServ.getSize();
        console.log(`Total registros teachers course sessions: ${tcsCount}`);
        this.logGateway.sendLog(`Total registros teachers course sessions: ${tcsCount}`);
        return tcsCount;
    }

    async generateRooms(data: any): Promise<number> {
        const def_max_occup_perc: number = 0.8;
        let indice: number = 1;
        const decima: number = Math.floor(data.length/10);
        for(const fila of data) {
            if(fila.hasOwnProperty('campus_name') && 
            fila.hasOwnProperty('room_capacity') &&
            fila.hasOwnProperty('room_name') &&
            fila.hasOwnProperty('roomtype_name')) {
                const dto = new ImportRoomDto();
                // Validaciones
                if(this.hasNonWhitespaceCharacters(fila.campus_name)){
                    dto.campus_name = fila.campus_name;
                } else {
                    throw new Error('fila.campus_name no puede ser vacio');
                }
                if(fila.room_capacity>0){
                    dto.room_capacity = fila.room_capacity;
                } else {
                    throw new Error('fila.room_capacity debe ser mayor que 0');
                }
                if(this.hasNonWhitespaceCharacters(fila.room_name)){
                    dto.room_name = fila.room_name;
                } else {
                    throw new Error('fila.room_name no puede ser vacio');
                }
                if(this.hasNonWhitespaceCharacters(fila.roomtype_name)){
                    dto.roomtype_name = fila.roomtype_name;
                } else {
                    throw new Error('fila.roomtype_name no puede ser vacio');
                }
                if(fila.hasOwnProperty('building_name') &&
                    this.hasNonWhitespaceCharacters(fila.building_name)){
                    dto.building_name = fila.building_name;
                } else {
                    dto.building_name = fila.campus_name;
                }
                if(fila.hasOwnProperty('roomtype_max_occup_perc') &&
                    fila.roomtype_max_occup_perc>=0 && fila.roomtype_max_occup_perc<=1){
                    dto.roomtype_max_occup_perc = fila.roomtype_max_occup_perc;
                } else {
                    dto.roomtype_max_occup_perc = def_max_occup_perc;
                }

                // Creacion campus
                let campusFound = await this.campusServ.getByName(dto.campus_name);
                if(!campusFound){
                    const dtoCampus: CreateCampusDto = new CreateCampusDto();
                    dtoCampus.name = dto.campus_name;
                    campusFound = await this.campusServ.createOne(dtoCampus);
                }

                // Creacion campus
                let buildingFound = await this.buildingServ.getByName(dto.building_name);
                if(!buildingFound){
                    const dtoBuilding: CreateBuildingDto = new CreateBuildingDto();
                    dtoBuilding.name = dto.building_name;
                    dtoBuilding.campus_id = campusFound.id;
                    buildingFound = await this.buildingServ.createOne(dtoBuilding);
                }

                // Creacion roomtype
                let roomTypeFound = await this.roomTypeServ.getByName(dto.roomtype_name);
                if(!roomTypeFound){
                    const dtoRoomType: CreateRoomTypeDto = new CreateRoomTypeDto();
                    dtoRoomType.name = dto.building_name;
                    dtoRoomType.max_occup_perc = dto.roomtype_max_occup_perc;
                    roomTypeFound = await this.roomTypeServ.createOne(dtoRoomType);
                }

                // Create room
                const dtoRoom: CreateRoomDto = new CreateRoomDto();
                dtoRoom.type_id = roomTypeFound.id;
                dtoRoom.building_id = buildingFound.id;
                dtoRoom.name = dto.room_name;
                dtoRoom.capacity = dto.room_capacity;

                this.roomServ.createOne(dtoRoom)
                .then(() => {
                    if(indice%decima===0){
                        this.logGateway.sendLog(`Filas procesadas: ${indice} de ${data.length}`);
                        this.logGateway.sendProgress((indice/(data.length))*100);
                    }
                });
            } else {
                this.logGateway.sendLog('Room no cuenta con las columnas requeridas');
                throw new Error('Room no cuenta con las columnas requeridas');
            }
            indice += 1;
        }
        this.logGateway.sendLog('Proceso de sooms completado');
        this.logGateway.sendProgress(100);
        const roomsCount = await this.roomServ.getSize();
        console.log(`Total registros Rooms: ${roomsCount}`);
        this.logGateway.sendLog(`Total registros Rooms: ${roomsCount}`);
        return roomsCount;
    }
}
