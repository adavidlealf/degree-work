import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { UploadService } from '../service/upload.service';

@Controller('upload')
export class UploadController {

    constructor(private service: UploadService){}

    @Post('curriculum')
    @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo en el formulario
    async uploadFileCurriculum(@UploadedFile() file: Express.Multer.File, @Res() response) {
        try {
            // Leer el archivo Excel
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            let bandera = false;
            // Iterar por las hojas del archivo
            workbook.SheetNames.forEach((sheetName) => {
                if (sheetName === 'curriculum') {
                    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    console.log(`${sheetName}`);
                    bandera = true;
                    this.service.generateCurriculum(data)
                    .then(rta => {
                        response.status(HttpStatus.CREATED).json(rta);
                        console.log('Funciono en controller!');
                    }).catch(err => {
                        response.status(HttpStatus.FORBIDDEN).json({
                            mensaje: `Error in generateCurriculum: ${err}`
                        });
                        console.log(`Error in generateCurriculum: ${err}`);
                    });
                    return;
                }
            });
            if(!bandera){
                response.status(HttpStatus.FORBIDDEN).json({
                    mensaje: `No se encontro la hoja 'curriculum'`
                });
                console.log(`No se encontro la hoja 'curriculum'`);
            }
        } catch (error) {
            response.status(HttpStatus.FORBIDDEN).json({
                mensaje: `Ocurrio un error en uploadFileCurriculum: ${error}`
            });
            console.log(`Ocurrio un error en uploadFileCurriculum: ${error}`);
        }
    }

}
