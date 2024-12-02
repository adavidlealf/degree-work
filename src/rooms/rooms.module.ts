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
import { BuildingController } from './controllers/building.controller';
import { CampusController } from './controllers/campus.controller';
import { RoomTypeController } from './controllers/room-type.controller';
import { RoomController } from './controllers/room.controller';

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
        BuildingController,
        CampusController,
        RoomTypeController,
        RoomController
    ],
    providers: [
        BuildingService,
        CampusService,
        RoomTypeService,
        RoomService,
    ],
})
export class RoomsModule {}
