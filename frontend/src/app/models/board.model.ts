export interface IBoard {
    name: string;
    description: string;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
    id?: string;
}

export class Board implements IBoard {
    name: string;
    description: string;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
    id?: string;

    constructor(
        name: string,
        description: string,
        categoryId: number,
        createdAt: Date,
        updatedAt: Date,
        id?: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}