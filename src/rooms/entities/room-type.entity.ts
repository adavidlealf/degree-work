import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "./room.entity";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({name: 'room_type'})
export class RoomTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 3, scale: 2 })
    max_occup_perc: number;

    @OneToMany(
        () => RoomEntity,
        (rooms: RoomEntity) => rooms.room_type
    )
    rooms: RoomEntity[];

    @OneToMany(
        () => SessionEntity,
        (sessions: SessionEntity) => sessions.room_type
    )
    sessions: SessionEntity[];
}