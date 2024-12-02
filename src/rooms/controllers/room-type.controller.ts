import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { RoomTypeService } from '../services/room-type.service';
import { CreateRoomTypeDto } from '../dto/create-room-type-dto';

@Controller('room type')
export class RoomTypeController {

    constructor(private service: RoomTypeService){}

    @Post()
    create(@Body() dto: CreateRoomTypeDto, @Res() response){
        this.service.createOne(dto)
        .then( one => {
            response.status(HttpStatus.CREATED).json(one);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the creation of the room type: ${e}`});
        });
    }

    @Post('bulk')
    createMany(@Body() dtos: CreateRoomTypeDto[], @Res() response) {
        this.service.createMany(dtos)
        .then( ones => {
            response.status(HttpStatus.CREATED).json(ones);
        }).catch((e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the bulk creation of the room types: ${e}`});
        });
    }

    @Get()
    getAll(@Res() response){
        this.service.getAll()
        .then( list => {
            response.status(HttpStatus.OK).json(list);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the room types: ${e}`});
        });
    }

    @Get(':id')
    getById(@Res() response,@Param('id') id){
        this.service.getById(id)
        .then( one => {
            response.status(HttpStatus.OK).json(one);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the getting of the room type by id: ${e}`});
        });
    }

    @Put(':id')
    update(@Body() dto: CreateRoomTypeDto, @Res() response, @Param('id') id : number){
        this.service.updateOne(id, dto)
        .then( updated => {
            response.status(HttpStatus.OK).json(updated);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the modification of the room type: ${e}`});
        });
    }

    @Delete(':id')
    delete(@Res() response, @Param('id') id : number){
        this.service.deleteOne(id)
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of the room type: ${e}`});
        });
    }

    @Delete()
    deleteAll(@Res() response){
        this.service.deleteAll()
        .then(res => {
            response.status(HttpStatus.OK).json(res);
        }).catch( (e) => {
            response.status(HttpStatus.FORBIDDEN).json(
                {mensaje: `Error in the elimination of all the room types: ${e}`});
        });
    }
}
