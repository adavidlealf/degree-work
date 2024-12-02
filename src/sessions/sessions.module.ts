import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { SessionEntity } from './entities/session.entity';
import { TeacherCourseSessionEntity } from './entities/teacher-course-session.entity';
import { CourseService } from './services/course.service';
import { SessionService } from './services/session.service';
import { TeacherService } from './services/teacher.service';
import { TeacherCourseSessionService } from './services/teacher-course-session.service';
import { SubjectEntity } from 'src/curriculum/entities/subject.entity';
import { RoomTypeEntity } from 'src/rooms/entities/room-type.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseEntity,
            TeacherEntity,
            SessionEntity,
            TeacherCourseSessionEntity,
            SubjectEntity,
            RoomTypeEntity,
        ]),
    ],
    controllers: [

    ],
    providers: [
        CourseService,
        SessionService,
        TeacherService,
        TeacherCourseSessionService
    ],
})
export class SessionsModule {}
