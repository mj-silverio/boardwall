export interface ICategory {
    id: number;
    name: string;
    description: string;
    position: number;
    boardWallId: number;
    createdAt: Date;
    updatedAt: Date;
}