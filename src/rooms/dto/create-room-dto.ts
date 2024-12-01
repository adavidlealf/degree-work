export class CreateRoomDto {
    readonly name: string;
    readonly capacity: number;
    readonly building_id: number;
    readonly type_id: number;
}