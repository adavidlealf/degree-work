import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgorithmController } from './controller/algorithm.controller';
import { AlgorithmService } from './service/algorithm.service';
import { BuildingEntity } from 'src/rooms/entities/building.entity';
import { BuildingService } from 'src/rooms/services/building.service';
import { CampusEntity } from 'src/rooms/entities/campus.entity';
import { CampusService } from 'src/rooms/services/campus.service';
import { CourseEntity } from 'src/sessions/entities/course.entity';
import { CourseService } from 'src/sessions/services/course.service';
import { CurriculumEntity } from 'src/curriculum/entities/curriculum.entity';
import { CurriculumService } from 'src/curriculum/services/curriculum.service';
import { LogGateway } from 'src/gateway/log.gateway';
import { ProgramEntity } from 'src/curriculum/entities/program.entity';
import { ProgramService } from 'src/curriculum/services/program.service';
import { RoomEntity } from 'src/rooms/entities/room.entity';
import { RoomService } from 'src/rooms/services/room.service';
import { RoomTypeEntity } from 'src/rooms/entities/room-type.entity';
import { RoomTypeService } from 'src/rooms/services/room-type.service';
import { SessionEntity } from 'src/sessions/entities/session.entity';
import { SessionService } from 'src/sessions/services/session.service';
import { SubjectEntity } from 'src/curriculum/entities/subject.entity';
import { SubjectService } from 'src/curriculum/services/subject.service';
import { TeacherCourseSessionEntity } from 'src/sessions/entities/teacher-course-session.entity';
import { TeacherCourseSessionService } from 'src/sessions/services/teacher-course-session.service';
import { TeacherEntity } from 'src/sessions/entities/teacher.entity';
import { TeacherService } from 'src/sessions/services/teacher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        BuildingEntity,
        CampusEntity,
        CourseEntity,
        CurriculumEntity,
        ProgramEntity,
        RoomEntity,
        RoomTypeEntity,
        SessionEntity,
        SubjectEntity,
        TeacherCourseSessionEntity,
        TeacherEntity,
    ]),
  ],
  controllers: [
    AlgorithmController,
  ],
  providers: [
    AlgorithmService,
    BuildingService,
    CampusService,
    CourseService,
    CurriculumService,
    LogGateway,
    ProgramService,
    RoomService,
    RoomTypeService,
    SessionService,
    SubjectService,
    TeacherCourseSessionService,
    TeacherService,
  ],
})
export class AlgorithmModule {}
