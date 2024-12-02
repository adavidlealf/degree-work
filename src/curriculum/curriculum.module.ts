import { Module } from '@nestjs/common';
import { SubjectEntity } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './entities/program.entity';
import { CurriculumEntity } from './entities/curriculum.entity';
import { CurriculumService } from './services/curriculum.service';
import { ProgramService } from './services/program.service';
import { SubjectService } from './services/subject.service';
import { CurriculumController } from './controllers/curriculum.controller';
import { ProgramController } from './controllers/program.controller';
import { SubjectController } from './controllers/subject.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubjectEntity,
            ProgramEntity,
            CurriculumEntity,
        ]),
    ],
    controllers: [
        CurriculumController,
        ProgramController,
        SubjectController
    ],
    providers: [
        CurriculumService,
        ProgramService,
        SubjectService
    ],
})
export class CurriculumModule {}
