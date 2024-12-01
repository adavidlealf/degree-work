import { Module } from '@nestjs/common';
import { CampusEntity } from './entities/campus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeEntity } from './entities/room-type.entity';
import { BuildingEntity } from './entities/building.entity';
import { RoomEntity } from './entities/room.entity';
import { CurriculumModule } from 'src/curriculum/curriculum.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CampusEntity,
            RoomTypeEntity,
            BuildingEntity,
            RoomEntity,
        ]),
    ],
    controllers: [

    ],
    providers: [

    ],
})
export class RoomsModule {}
