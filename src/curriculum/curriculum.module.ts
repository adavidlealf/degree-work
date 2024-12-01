import { Module } from '@nestjs/common';
import { SubjectEntity } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './entities/program.entity';
import { CurriculumEntity } from './entities/curriculum.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubjectEntity,
            ProgramEntity,
            CurriculumEntity,
        ]),
    ],
    controllers: [

    ],
    providers: [

    ],
})
export class CurriculumModule {}