import { Module } from '@nestjs/common';
import { SubjectEntity } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './entities/program.entity';
import { CurriculumEntity } from './entities/curriculum.entity';

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
