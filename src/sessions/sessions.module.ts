import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { SessionEntity } from './entities/session.entity';
import { TeacherCourseSessionEntity } from './entities/course-session-teacher.entity';
import { CurriculumModule } from 'src/curriculum/curriculum.module';
import { RoomsModule } from 'src/rooms/rooms.module';

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
