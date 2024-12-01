import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CampusEntity } from "./campus.entity";
import { RoomEntity } from "./room.entity";

@Entity({name: 'building'})
export class BuildingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(
        () => CampusEntity,
        (campus: CampusEntity) => campus.buildings,
    {
        onDelete: 'RESTRICT'
    })
    @JoinColumn({name: 'campus_id'})
    campus: CampusEntity;

    @OneToMany(
        () => RoomEntity,
        (rooms: RoomEntity) => rooms.building
    )
    rooms: RoomEntity[];
}