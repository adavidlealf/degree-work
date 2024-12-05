import { Injectable } from '@nestjs/common';
import { CurriculumService } from 'src/curriculum/services/curriculum.service';
import { ProgramService } from 'src/curriculum/services/program.service';
import { SubjectService } from 'src/curriculum/services/subject.service';
import { LogGateway } from 'src/gateway/log.gateway';
import { BuildingService } from 'src/rooms/services/building.service';
import { CampusService } from 'src/rooms/services/campus.service';
import { RoomTypeService } from 'src/rooms/services/room-type.service';
import { RoomService } from 'src/rooms/services/room.service';
import { CourseService } from 'src/sessions/services/course.service';
import { SessionService } from 'src/sessions/services/session.service';
import { TeacherCourseSessionService } from 'src/sessions/services/teacher-course-session.service';
import { TeacherService } from 'src/sessions/services/teacher.service';

@Injectable()
export class AlgorithmService {

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
    ) { }

    // Map of <vertice.id, index>
    private indices: Map<number, number>;
    // Array of [i] = vertice.id
    private i_vertices: number[];
    // Array of sets of numbers, represent adjacency list of conflicts
    private g: Set<number>[];

    /**
     * Generate an index of each vertice
     */
    async generateIndices() {
        this.indices = new Map<number, number>();
        this.i_vertices = [];
        const vertices = await this.tcsServ.getAllIds();
        for (let i = 0; i < vertices.length; i++) {
            this.indices.set(vertices[i], i);
            this.i_vertices.push(vertices[i]);
        }
    }

    /**
     * 
     * @returns n number of vertices
     */
    getN(): number {
        return this.i_vertices.length;
    }

    /**
     * 
     * @returns nrt number of room types
     */
    async getNrt(): Promise<number> {
        return await this.roomTypeServ.getSize();
    }

    /**
     * 
     * @returns nc number of colors
     */
    getNc(): number {
        const days: number = 5;
        const timeslotsPerDay: number = 6;
        return days * timeslotsPerDay;
    }

    /**
     * 
     * @returns nr number of rooms
     */
    async getNr(): Promise<number> {
        return await this.roomServ.getSize();
    }

    /**
     * Dado un arreglo de ids de vertices en conflicto, se generan las aristas entre todos.
     * @param verticesParam number[] arreglo de ids de vertices
     */
    createEdges(verticesParam: number[]) {
        let inds: number[] = []; // Arreglo de indices de vertices parametro
        for (const vTmp of verticesParam) {
            inds.push(this.indices.get(vTmp)); // Llenar indFromT
        }
        // Crear aristas
        for (let i = 0; i < verticesParam.length; i++) {
            for (let j = 0; j < verticesParam.length; j++) {
                if (i != j) {
                    this.g[inds[i]].add(inds[j]);
                }
            }
        }
    }

    async generateG() {
        this.generateIndices(); // Generar indice a cada vertice
        const n = this.getN(); // Numero de vertices
        this.g = Array.from({ length: n }, () => new Set<number>()); // Lista de adyacencia

        // Conflictos por teacher
        const teachers = await this.teacherServ.getAllIds(); // Obtener todos los id de teachers
        for (const teacher of teachers) {
            const vsFromT = await this.tcsServ.getIdsByTeacher(teacher); // Obtener id de vertices por teacher
            this.createEdges(vsFromT); // Crear aristas
        }

        // Conflictos por program y term de curriculum
        const programs = await this.programServ.getAllIds(); // Obtener todos los id de programs
        for (const program of programs) {
            // Obtener los distintos terms del curriculum del program
            const termsFromProgram = await this.currServ.getDistinctTermsByProgram(program);
            for (const term of termsFromProgram) {
                // Obtener los distintos subjects del curriculum del programa en el term
                const suggestedSubjects = await this.currServ.getSubjectIdsByProgramTerm(term, program);
                let vsFromSuggSubject: number[]; // vertices de los mismos subject sugeridos para el program en el term
                for (const suggSubject of suggestedSubjects) {
                    vsFromSuggSubject.push(...(await this.tcsServ.getIdsBySubject(suggSubject)));
                }
                this.createEdges(vsFromSuggSubject); // Crear aristas
            }
        }

        // // Conflictos por course // Se descarta por la naturaleza del caso de estudio
        // const courses = await this.courseServ.getAllIds(); // Obtener todos los id de courses
        // for(const course of courses){
        //     const vsFromC = await this.tcsServ.getByCourse(course); // Obtener id de vertices por courses
        //     this.createEdges(vsFromC); // Crear aristas
        // }
    }
}
