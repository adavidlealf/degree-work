import { Module } from '@nestjs/common';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';
import { SubjectService } from 'src/curriculum/services/subject.service';
import { ProgramService } from 'src/curriculum/services/program.service';
import { CurriculumService } from 'src/curriculum/services/curriculum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/curriculum/entities/subject.entity';
import { ProgramEntity } from 'src/curriculum/entities/program.entity';
import { CurriculumEntity } from 'src/curriculum/entities/curriculum.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
          SubjectEntity,
          ProgramEntity,
          CurriculumEntity,
      ]),
  ],
  controllers: [
    UploadController
  ],
  providers: [
    UploadService,
    SubjectService,
    ProgramService,
    CurriculumService,
  ]
})
export class ImportModule {}
