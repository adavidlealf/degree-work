import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto } from '../dto/create-teacher-dto';

@Controller('teacher')
export class TeacherController {

    constructor(private service: TeacherService){}

    @Post()
    create(@Body() dto: CreateTeacherDto, @Res() response){
        this.service.createOne(dto)
        .then( one => {
            response.status(HttpStatus.CREATED).json(one);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the creation of the teacher: ${e}`});
        });
    }

    @Post('bulk')
    createMany(@Body() dtos: CreateTeacherDto[], @Res() response) {
        this.service.createMany(dtos)
        .then( ones => {
            response.status(HttpStatus.CREATED).json(ones);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the bulk creation of the teachers: ${e}`});
        });
    }

    @Get()
    getAll(@Res() response){
        this.service.getAll()
        .then( list => {
            response.status(HttpStatus.OK).json(list);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the teachers: ${e}`});
        });
    }

    @Get(':id')
    getById(@Res() response,@Param('id') id){
        this.service.getById(id)
        .then( one => {
            response.status(HttpStatus.OK).json(one);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the teacher by id: ${e}`});
        });
    }

    @Put(':id')
    update(@Body() dto: CreateTeacherDto, @Res() response, @Param('id') id : number){
        this.service.updateOne(id, dto)
        .then( updated => {
            response.status(HttpStatus.OK).json(updated);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the modification of the teacher: ${e}`});
        });
    }

    @Delete(':id')
    delete(@Res() response, @Param('id') id : number){
        this.service.deleteOne(id)
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of the teacher: ${e}`});
        });
    }

    @Delete()
    deleteAll(@Res() response){
        this.service.deleteAll()
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of all the teachers: ${e}`});
        });
    }
}
