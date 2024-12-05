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

    // Porcentaje de ocupacion maxima de tipo de salon por defecto
    private def_perc: number = 0.8;

    // Numero de vertices
    private n: number;

    // Numero de campus
    private ncampus: number;

    // Numero de tipos de salon
    private nrt: number;

    // Numero de colores
    private nc: number;

    // Numero de salones
    private nr: number;

    // Map of <vertice.id, index>
    private indices_v: Map<number, number>;

    // Array of [i] = vertice.id
    private i_vertices: number[];

    // Map of <campus.id, index>
    private indices_cmps: Map<number, number>;

    // Array of [i] = campus.id
    private i_campus: number[];

    // Map of <roomtype.id, index>
    private indices_rt: Map<number, number>;

    // Array of [i] = roomtype.id
    private i_roomtype: number[];

    // Map of <room.id, index>
    private indices_r: Map<number, number>;

    // Array of [i] = room.id
    private i_room: number[];

    // Array of sets of numbers, represent adjacency list of conflicts
    private g: Set<number>[];

    // Color actual con disponibilidad por tipo de salon
    private last_color_ts: number[]; // length nrt

    // Ocupacion actual de tipos de salon por cada color
    private occup: number[][]; //[nc][nrt]

    // cantidad de salones por tipo de salon
    private total_disp: number[]; //[nrt]

    // Matriz de salones por tipo de salon en cada campus
    private rooms: number[][][]; // [ncampus] [nrt] [nr de ese rt]

    // Maxima cantidad de salones que pueden ser ocupados por tipo de salon
    private max_occup: number[]; // [nrt]

    // Disponibilidad de salon en color
    private c_rooms: boolean[][]; // [nc] [nr]

    // Salon asignado a cada vertice
    private v_rooms: number[]; // [n]

    // Capacidad de cada salon
    private cap_rooms: number[]; //[nr]

    // Clases de colores, contienen los vertices coloreados
    private c_vertices: number[][]; // [nc] []

    // Colores de cada vertice
    private v_colors: number[][]; // [n] [2]

    // Campus obligatorio de cada vertice
    private v_campus: number[]; // [n]

    /**
     * Generate an index of each vertice
     */
    async generateIndicesVertices() {
        this.indices_v = new Map<number, number>();
        this.i_vertices = [];
        const vertices = await this.tcsServ.getAllIds();
        this.n = vertices.length;
        for (let i = 0; i < vertices.length; i++) {
            this.indices_v.set(vertices[i], i);
            this.i_vertices.push(vertices[i]);
        }
    }

    /**
     * Generate an index of each campus
     */
    async generateIndicesCampus() {
        this.indices_cmps = new Map<number, number>();
        this.i_campus = [];
        const campus = await this.campusServ.getAllIds();
        this.ncampus = campus.length;
        for (let i = 0; i < campus.length; i++) {
            this.indices_cmps.set(campus[i], i);
            this.i_campus.push(campus[i]);
        }
    }

    /**
     * Generate an index of each vertice
     */
    async generateIndicesRoomType() {
        this.indices_rt = new Map<number, number>();
        this.i_roomtype = [];
        const roomtypes = await this.roomTypeServ.getAllIds();
        this.nrt = roomtypes.length;
        for (let i = 0; i < roomtypes.length; i++) {
            this.indices_rt.set(roomtypes[i], i);
            this.i_roomtype.push(roomtypes[i]);
        }
    }

    /**
     * Generate an index of each room
     */
    async generateIndicesRoom() {
        this.indices_r = new Map<number, number>();
        this.i_room = [];
        const rooms = await this.roomServ.getAllIds();
        this.nr = rooms.length;
        for (let i = 0; i < rooms.length; i++) {
            this.indices_r.set(rooms[i], i);
            this.i_room.push(rooms[i]);
        }
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
     * Inicializa el arreglo last_color_ts por cada tipo de salon con 1
     */
    async initLastColor() {
        for (let i = 0; i < this.nrt; i++) {
            this.last_color_ts.push(1);
        }
    }

    /**
     * Inicializa la matriz de ocupacion actual de cada color por cada tipo de salon con 0.
     */
    initOccup() {
        this.nc = this.getNc();
        this.occup = [];
        for (let i = 0; i < this.nc; i++) {
            const row: number[] = [];
            for (let j = 0; j < this.nrt; j++) {
                row.push(0);
            }
            this.occup.push(row);
        }
    }

    /**
     * Matriz tridimensional de salones por tipos de salones por campus
     */
    async generateRooms() {
        this.rooms = [];
        for (let i = 0; i < this.ncampus; i++) {
            const rowTypesForCampus: number[][] = [];
            for (let j = 0; j < this.nrt; j++) {
                const roomsByCampType =
                    await this.roomServ.getIdsByCampusType(this.i_campus[j], this.i_roomtype[j]);
                rowTypesForCampus.push(roomsByCampType);
            }
            this.rooms.push(rowTypesForCampus);
        }
    }

    /**
     * Cuenta la cantidad de salones por tipo de salon
     */
    generateTotalDisp() {
        this.total_disp = [];
        for (let i = 0; i < this.nrt; i++) {
            this.total_disp.push(0);
            for (let j = 0; j < this.ncampus; j++) {
                this.total_disp[i] += this.rooms[j][i].length;
            }
        }
    }

    /**
     * Calcula la Maxima cantidad de salones que pueden ser ocupados por tipo de salon
     */
    async generateMaxOccup() {
        this.max_occup = [];
        for (let i = 0; i < this.nrt; i++) {
            let perc = await this.roomTypeServ.getMaxOccupPercById(this.i_roomtype[i]);
            perc = (perc ? perc : this.def_perc);
            this.max_occup.push(Math.ceil(perc * this.total_disp[i]));
        }
    }

    /**
     * Inicializa la ocupacion de cada salon en cada color en false.
     */
    initColorRooms() {
        this.c_rooms = [];
        for (let i = 0; i < this.nc; i++) {
            const row: boolean[] = [];
            for (let j = 0; j < this.nr; j++) {
                row.push(false);
            }
            this.c_rooms.push(row);
        }
    }

    /**
     * Inicializa los salones de cada vertice en -1
     */
    initVerticeRooms() {
        this.v_rooms = [];
        for (let i = 0; i < this.n; i++) {
            this.v_rooms.push(-1);
        }
    }

    /**
     * Carga la capacidad de cada salon
     */
    async initCapacRooms() {
        this.cap_rooms = [];
        for (let i = 0; i < this.nr; i++) {
            const capTmp = await this.roomServ.getCapacityById(this.i_room[i]);
            this.cap_rooms.push((capTmp ? capTmp : 0));
        }
    }

    async generateRoomStructures() {
        this.generateIndicesCampus();
        this.generateIndicesRoomType();
        this.generateIndicesRoom();

        this.initLastColor();
        this.initOccup();
        this.generateRooms();
        this.generateTotalDisp();
        this.generateMaxOccup();
        this.initColorRooms();
        this.initVerticeRooms();
        this.initCapacRooms();
    }

    /**
     * Inicializa las clases de colores, con arreglos vacios por cada color
     */
    initColorClases() {
        this.c_vertices = Array.from({length: this.nc}, () => []);
    }

    /**
     * Inicializa los colores de los vertices, con arreglos de 2 ceros por cada vertice
     */
    initVerticeColors() {
        this.v_colors = Array.from({length: this.n}, () => [0,0]);
    }

    /**
     * Inicializa los campus obligatorios de cada vertice con 0.
     */
    initCampusVertice() {
        this.v_campus = Array.from({length: this.n}, () => 0);
    }

    /**
     * Dado un arreglo de ids de vertices en conflicto, se generan las aristas entre todos.
     * @param verticesParam number[] arreglo de ids de vertices
     */
    createEdges(verticesParam: number[]) {
        let inds: number[] = []; // Arreglo de indices de vertices parametro
        for (const vTmp of verticesParam) {
            inds.push(this.indices_v.get(vTmp)); // Llenar indFromT
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

    /**
     * Generar grafo (lista de adyacencia) en base a los conflictos de teacher-course-session
     */
    async generateG() {
        this.generateIndicesVertices(); // Generar indice a cada vertice
        this.g = Array.from({ length: this.n }, () => new Set<number>()); // Lista de adyacencia

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

    /**
     * En base a la informacion de la base de datos, genera las estructuras requeridas para el algoritmo
     */
    async crearEstructuras(){
        await this.generateG();
        await this.generateRoomStructures();
        this.initColorClases();
        this.initVerticeColors();
        this.initCampusVertice();
    }

    /**
     * Algoritmo
     */
    async main() {
        await this.crearEstructuras();
    }
}
