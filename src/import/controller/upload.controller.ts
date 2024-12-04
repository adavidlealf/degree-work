import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { UploadService } from '../service/upload.service';

@Controller('upload')
export class UploadController {

    constructor(private service: UploadService){}

    @Post('curriculum')
    @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo en el formulario
    uploadFileCurriculum(@UploadedFile() file: Express.Multer.File, @Res() response) {
        // Leer el archivo Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        // Bandera que indica cuando se encuentre la hoja titulada 'curriculum'
        let bandera = false;
        // Iterar por las hojas del archivo
        for(const sheetName of workbook.SheetNames){
            if (sheetName === 'curriculum') {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                console.log(`${sheetName} sheet found`);
                bandera = true;
                this.service.generateCurriculum(data)
                .then((rta) => {
                    console.log(`rta: ${rta}`);
                    response.status(HttpStatus.CREATED).json(rta);
                }).catch((err) => {
                    console.log(`Error in generateCurriculum: ${err}`);
                    response.status(HttpStatus.FORBIDDEN).json({
                        mensaje: `Error in generateCurriculum: ${err}`
                    });
                });
                break;
            }
        };
        if(!bandera){
            console.log(`No se encontro la hoja 'curriculum'`);
            response.status(HttpStatus.FORBIDDEN).json({
                mensaje: `No se encontro la hoja 'curriculum'`
            });
        }
    }

    @Post('session')
    @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo en el formulario
    uploadFileSession(@UploadedFile() file: Express.Multer.File, @Res() response) {
        // Leer el archivo Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        // Bandera que indica cuando se encuentre la hoja titulada 'session'
        let bandera = false;
        // Iterar por las hojas del archivo
        for(const sheetName of workbook.SheetNames){
            if (sheetName === 'session') {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                console.log(`${sheetName} sheet found`);
                bandera = true;
                this.service.generateSessions(data)
                .then((rta) => {
                    console.log(`rta: ${rta}`);
                    response.status(HttpStatus.CREATED).json(rta);
                }).catch((err) => {
                    console.log(`Error in generateSession: ${err}`);
                    response.status(HttpStatus.FORBIDDEN).json({
                        mensaje: `Error in generateSession: ${err}`
                    });
                });
                break;
            }
        };
        if(!bandera){
            console.log(`No se encontro la hoja 'session'`);
            response.status(HttpStatus.FORBIDDEN).json({
                mensaje: `No se encontro la hoja 'session'`
            });
        }
    }

    @Post('room')
    @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo en el formulario
    uploadFileRoom(@UploadedFile() file: Express.Multer.File, @Res() response) {
        // Leer el archivo Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        // Bandera que indica cuando se encuentre la hoja titulada 'session'
        let bandera = false;
        // Iterar por las hojas del archivo
        for(const sheetName of workbook.SheetNames){
            if (sheetName === 'room') {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                console.log(`${sheetName} sheet found`);
                bandera = true;
                this.service.generateRooms(data)
                .then((rta) => {
                    console.log(`rta: ${rta}`);
                    response.status(HttpStatus.CREATED).json(rta);
                }).catch((err) => {
                    console.log(`Error in generateRoom: ${err}`);
                    response.status(HttpStatus.FORBIDDEN).json({
                        mensaje: `Error in generateRoom: ${err}`
                    });
                });
                break;
            }
        };
        if(!bandera){
            console.log(`No se encontro la hoja 'room'`);
            response.status(HttpStatus.FORBIDDEN).json({
                mensaje: `No se encontro la hoja 'room'`
            });
        }
    }

}
