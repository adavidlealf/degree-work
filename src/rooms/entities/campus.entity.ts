import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BuildingEntity } from "./building.entity";

@Entity({name: 'campus'})
export class CampusEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        () => BuildingEntity,
        (buildings: BuildingEntity) => buildings.campus
    )
    buildings: BuildingEntity[];
}