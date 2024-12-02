import { Module } from '@nestjs/common';
import { CampusEntity } from './entities/campus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeEntity } from './entities/room-type.entity';
import { BuildingEntity } from './entities/building.entity';
import { RoomEntity } from './entities/room.entity';
import { BuildingService } from './services/building.service';
import { CampusService } from './services/campus.service';
import { RoomTypeService } from './services/room-type.service';
import { RoomService } from './services/room.service';

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
        BuildingService,
        CampusService,
        RoomTypeService,
        RoomService,
    ],
})
export class RoomsModule {}
