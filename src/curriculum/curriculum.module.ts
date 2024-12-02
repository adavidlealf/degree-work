import { Module } from '@nestjs/common';
import { SubjectEntity } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './entities/program.entity';
import { CurriculumEntity } from './entities/curriculum.entity';
import { CurriculumService } from './services/curriculum.service';
import { ProgramService } from './services/program.service';
import { SubjectService } from './services/subject.service';

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
        CurriculumService,
        ProgramService,
        SubjectService
    ],
})
export class CurriculumModule {}
