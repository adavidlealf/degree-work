import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { CampusService } from '../services/campus.service';
import { CreateCampusDto } from '../dto/create-campus-dto';

@Controller('campus')
export class CampusController {

    constructor(private service: CampusService){}

    @Post()
    create(@Body() dto: CreateCampusDto, @Res() response){
        this.service.createOne(dto)
        .then( one => {
            response.status(HttpStatus.CREATED).json(one);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the creation of the campus: ${e}`});
        });
    }

    @Post('bulk')
    createMany(@Body() dtos: CreateCampusDto[], @Res() response) {
        this.service.createMany(dtos)
        .then( ones => {
            response.status(HttpStatus.CREATED).json(ones);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the bulk creation of the campuss: ${e}`});
        });
    }

    @Get()
    getAll(@Res() response){
        this.service.getAll()
        .then( list => {
            response.status(HttpStatus.OK).json(list);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the campuss: ${e}`});
        });
    }

    @Get(':id')
    getById(@Res() response,@Param('id') id){
        this.service.getById(id)
        .then( one => {
            response.status(HttpStatus.OK).json(one);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the campus by id: ${e}`});
        });
    }

    @Put(':id')
    update(@Body() dto: CreateCampusDto, @Res() response, @Param('id') id : number){
        this.service.updateOne(id, dto)
        .then( updated => {
            response.status(HttpStatus.OK).json(updated);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the modification of the campus: ${e}`});
        });
    }

    @Delete(':id')
    delete(@Res() response, @Param('id') id : number){
        this.service.deleteOne(id)
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of the campus: ${e}`});
        });
    }

    @Delete()
    deleteAll(@Res() response){
        this.service.deleteAll()
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of all the campuss: ${e}`});
        });
    }
}
