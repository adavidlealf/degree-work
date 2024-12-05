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
        private readonly programServ: ProgramService,
        private readonly roomServ: RoomService,
        private readonly roomTypeServ: RoomTypeService,
        private readonly teacherServ: TeacherService,
        private readonly tcsServ: TeacherCourseSessionService,
        private readonly campusServ: CampusService,
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
    private G: Set<number>[];

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

    // Tamano de grupo de cada vertice
    private v_gsize: number[]; // [n]

    // Clases de colores, contienen los vertices coloreados
    private c_vertices: number[][]; // [nc] []

    // Colores de cada vertice
    private v_colors: number[][]; // [n] [2]

    // Roomtype required por cada vertice
    private v_roomtype: number[]; // [n]

    // Campus unico que ofrece cada room type, o 0 si hay mas de un campus
    private rt_campus: number[]; // [nrt]

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
     * Inicializa el arreglo last_color_ts por cada tipo de salon con 0 (es decir, primer color)
     */
    initLastColor() {
        for (let i = 0; i < this.nrt; i++) {
            this.last_color_ts.push(0);
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
                const room_inds: number[] = roomsByCampType.map(room_id => this.indices_r.get(room_id));
                rowTypesForCampus.push(room_inds);
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

    async initGroupSizeVert() {
        this.v_gsize = [];
        for (let i = 0; i < this.n; i++) {
            const gsize = await this.tcsServ.getGroupSizeIdById(this.i_vertices[i]);
            this.v_gsize.push((gsize ? gsize : 0));
        }
    }

    /**
     * Genera el tipo de salon requerido de cada vertice.
     */
    async generateRoomTypeReqVert() {
        this.v_roomtype = [];
        for (const i of this.i_vertices) {
            const rtTmp = await this.tcsServ.getRoomTypeIdById(i);
            this.v_roomtype.push(this.indices_rt.get(rtTmp));
        }
    }

    /**
     * Calculan el id del campus unico que ofrece cada tipo de salon.
     */
    async generateCampusRoomType() {
        this.rt_campus = [];
        for (const rt of this.i_roomtype) {
            const rta: number[] = await this.roomTypeServ.getCampusIdsByRoomType(rt);
            if (rta.length > 1) {
                this.rt_campus.push(0);
            } else {
                this.rt_campus.push(rta[0]);
            }
        }
    }

    async generateRoomStructures() {
        await this.generateIndicesCampus();
        await this.generateIndicesRoomType();
        await this.generateIndicesRoom();

        this.initLastColor();
        this.initOccup();
        await this.generateRooms();
        this.generateTotalDisp();
        await this.generateMaxOccup();
        this.initColorRooms();
        this.initVerticeRooms();
        await this.initCapacRooms();
        await this.generateRoomTypeReqVert();
        await this.generateCampusRoomType();
    }

    /**
     * Inicializa las clases de colores, con arreglos vacios por cada color
     */
    initColorClases() {
        this.c_vertices = Array.from({ length: this.nc }, () => []);
    }

    /**
     * Inicializa los colores de los vertices, con arreglos de 2 ceros por cada vertice
     */
    initVerticeColors() {
        this.v_colors = Array.from({ length: this.n }, () => [-1, -1]);
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
                    this.G[inds[i]].add(inds[j]);
                }
            }
        }
    }

    /**
     * Generar grafo (lista de adyacencia) en base a los conflictos de teacher-course-session
     */
    async generateG() {
        this.generateIndicesVertices(); // Generar indice a cada vertice
        this.G = Array.from({ length: this.n }, () => new Set<number>()); // Lista de adyacencia

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
     * Algoritmo
     */
    async main() {
        await this.crearEstructuras();
        await this.colorearGrafo();
        this.asignarSalones();
    }

    /**
     * En base a la informacion de la base de datos, genera las estructuras requeridas para el algoritmo
     */
    async crearEstructuras() {
        await this.generateG();
        await this.generateRoomStructures();
        this.initColorClases();
        this.initVerticeColors();
        this.initGroupSizeVert();
    }

    /**
     * Actualiza las estructuras relacionadas a la coloracion de un vertice
     * @param color number color a asignar
     * @param vertice number indice del vertice a colorear
     * @param typeroom number indice del tipo de salon del vertice
     * @param indice_color number numero de color del vertice (0 o 1)
     */
    colearVertice(color: number, vertice: number, typeroom: number, indice_color: number): void {
        this.c_vertices[color].push(vertice);
        this.v_colors[vertice][indice_color] = color;
        this.occup[color][typeroom] += 1;
    }

    duplicarVertice(indice_vertice) {

    }

    /**
     * 
     * @param Q number[] cola de indices de vertices sin colorear de misma cantidad de timeslots
     * @param nb number timeslots factor comun
     */
    colorearCola(Q: number[], nb: number): number[] {
        let qh: number[]; // cola huerfanos
        while (Q.length > 0) {
            let vi: number = Q[length - 1]; // indice del vertice a colorear = elemento front de la cola sin colorear
            const tsr: number = this.v_roomtype[vi]; // tipo de salon requerido
            let uc = this.last_color_ts[tsr]; // ultimo color con disponibilidad
            while (true) {
                if ((nb === 2) && (uc > 14)) {
                    // COPIAS / REVISAR LOGICA PARA AUMENTAR N Y MODIFICAR ESTRUCTURAS
                } else {
                    let b2: boolean = false; // bandera 2 de adyacentes de vi en uc
                    for (const vcu of this.c_vertices[uc]) { // buscar adyacentes de vi en uc
                        if (this.G[vi].has(vcu)) {
                            b2 = true;
                            break;
                        }
                    }
                    if (b2) { // adyacente de vi en color uc
                        if (uc >= this.nc) { // si ya no hay colores
                            qh.unshift(vi);
                            break; // break while true
                        } else {
                            uc += 1; // probar con siguiente color
                            continue; // siguiente iteracion del while
                        }
                    }
                    // Colorear vi con uc
                    this.colearVertice(uc, vi, tsr, 0);
                    if (nb === 2) { // Si vertice requiere dos timeslots consecutivos
                        this.colearVertice(uc + 15, vi, tsr, 1);
                    }
                    if (this.occup[uc][tsr] >= this.max_occup[tsr]) {
                        this.last_color_ts[tsr] += 1;
                    }
                }
                break;
            }
            Q.pop();
        }
        return qh;
    }

    /**
     * Coloracion total del grafo. Si arroja un error fue porque la disponibilidad de 
     * los colores no fue suficiente para algun tipo de salon de los vertices.
     */
    async colorearGrafo() {
        const vs2: number[] = await this.tcsServ.getIdsByTimeslots(2);
        const ind_vs2: number[] = vs2.map(idV2 => this.indices_v.get(idV2));
        // ordenados de menor a mayor grado, ya que colorearCola toma el ultimo de la lista
        const sortedVs2: number[] = ind_vs2.sort((a, b) => this.G[a].size - this.G[b].size);
        let qh1: number[] = this.colorearCola(sortedVs2, 2);
        if (qh1.length > 0) {
            let qh2: number[] = this.colorearCola(qh1, 1);
            if (qh2.length > 0) {
                throw new Error('Disponibilidad de colores insuficientes');
            }
        }

        //
        const vs1: number[] = await this.tcsServ.getIdsByTimeslots(1);
        const ind_vs1: number[] = vs1.map(idV1 => this.indices_v.get(idV1));
        // ordenados de menor a mayor grado, ya que colorearCola toma el ultimo de la lista
        const sortedVs1: number[] = ind_vs1.sort((a, b) => this.G[a].size - this.G[b].size);
        let qh3: number[] = this.colorearCola(sortedVs1, 1);
        if (qh3.length > 0) {
            throw new Error('Disponibilidad de colores insuficientes');
        }
    }

    /**
     * Asigna un salon al vertice en el color y campus dados, cumpliendo la capacidad requerida 
     * @param tsr number indice del tipo de salon requerido
     * @param i_c number color del vertice
     * @param cmp_i number indice del campus
     * @param i number indice del vertice
     * @returns true en caso de poder asignar un salon al vertice en el color y campus dados, cumpliendo la capacidad requerida 
     */
    asignarSalonPorCampus(tsr: number, i_c: number, cmp_i: number, i: number): boolean {
        for (const i_r of this.rooms[cmp_i][tsr]) {
            if ((!this.c_rooms[i_c][i_r]) && (this.cap_rooms[i_r] >= this.v_gsize[i])) {
                this.c_rooms[i_c][i_r] = true;
                this.v_rooms[i] = i_r;
                return true;
            }
        }
        return false;
    }

    /**
     * Revisa si el color es el ultimo timeslot de su dia
     * @param color number numero de color
     */
    isLastColorOfTheDay(color: number): boolean {
        return (color === 22 || color === 29 || color === 23 || color === 30 || color === 24);
    }

    /**
     * Calcula el numero del color consecutivo en el mismo dia.
     * @param color number numero de color
     */
    getConsecutiveColor(color: number): number {
        return color + 15;
    }

    /**
     * 
     * @param i_c number numero del color del vertice
     * @param i number indice del vertice
     * @returns indice del campus del vertice adyacente, en caso de encontrarlo
     */
    getCampusAdyacente(i_c: number, i: number) {
        if (!this.isLastColorOfTheDay(i_c)) {
            const cc = this.getConsecutiveColor(i_c);
            for (const va of this.c_vertices[cc]) { // vertices del color consecutivo
                if (this.G[i].has(va) && this.rt_campus[this.v_roomtype[va]] != 0) {
                    return this.rt_campus[this.v_roomtype[va]];
                }
            }
        }
        return 0;
    }

    /**
     * Intenta asignar un salon a cada vertice.
     */
    asignarSalones(): void {
        let q: number[] = [];
        for (let i = 0; i < this.n; i++) {
            const tsr: number = this.v_roomtype[i]; // tipo de salon requerido
            const i_c: number = this.v_colors[i][0];
            const cmp_i: number = this.rt_campus[tsr];
            if (cmp_i != 0 && this.asignarSalonPorCampus(tsr, i_c, cmp_i, i)) {
                continue;
            }
            q.push(i);
        }
        let qh: number[] = [];
        for (const i of q) {
            const tsr: number = this.v_roomtype[i]; // tipo de salon requerido
            const i_c: number = this.v_colors[i][0];
            let cmp_i: number = this.getCampusAdyacente(i_c, i);
            let asignado = false;
            let campusToTry: Set<number> = new Set(this.indices_cmps.values());
            do {
                asignado = (this.asignarSalonPorCampus(tsr, i_c, cmp_i, i));
                if (!campusToTry.delete(cmp_i)) {
                    campusToTry.clear(); // Vaciar intentos en caso de no poder borrar el que se intento por ultima vez
                }
            } while (!asignado && campusToTry.size > 0);
            if (!asignado) {
                qh.push(i);
            }
        }
        if (qh.length > 0) {
            throw new Error(`No se pudieron asignar a salones los siguientes vertices: ${qh.toString()}`);
        }
    }
}
