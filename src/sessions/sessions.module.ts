import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { SessionEntity } from './entities/session.entity';
import { TeacherCourseSessionEntity } from './entities/teacher-course-session.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseEntity,
            TeacherEntity,
            SessionEntity,
            TeacherCourseSessionEntity,
        ]),
    ],
    controllers: [

    ],
    providers: [

    ],
})
export class SessionsModule {}
