import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BuildingEntity } from "./building.entity";
import { RoomTypeEntity } from "./room-type.entity";

@Entity({name: 'room'})
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @ManyToOne(
        () => BuildingEntity,
        (building: BuildingEntity) => building.rooms,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'building_id'})
    building: BuildingEntity;

    @ManyToOne(
        () => RoomTypeEntity,
        (room_type: RoomTypeEntity) => room_type.rooms,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'type_id'})
    room_type: RoomTypeEntity;
}