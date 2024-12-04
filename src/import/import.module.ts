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
import { LogGateway } from './gateway/log.gateway';
import { RoomTypeService } from 'src/rooms/services/room-type.service';
import { TeacherService } from 'src/sessions/services/teacher.service';
import { CourseService } from 'src/sessions/services/course.service';
import { SessionService } from 'src/sessions/services/session.service';
import { TeacherCourseSessionService } from 'src/sessions/services/teacher-course-session.service';
import { RoomTypeEntity } from 'src/rooms/entities/room-type.entity';
import { TeacherEntity } from 'src/sessions/entities/teacher.entity';
import { CourseEntity } from 'src/sessions/entities/course.entity';
import { SessionEntity } from 'src/sessions/entities/session.entity';
import { TeacherCourseSessionEntity } from 'src/sessions/entities/teacher-course-session.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
          SubjectEntity,
          ProgramEntity,
          CurriculumEntity,
          RoomTypeEntity,
          TeacherEntity,
          CourseEntity,
          SessionEntity,
          TeacherCourseSessionEntity,
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
    RoomTypeService,
    TeacherService,
    CourseService,
    SessionService,
    TeacherCourseSessionService,
    LogGateway,
  ]
})
export class ImportModule {}
