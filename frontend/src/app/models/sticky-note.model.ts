export interface IStickyNote {
    title: string;
    content: string;
    color: string;
    size: string;
    boardId: string;
    createdAt: Date;
    updatedAt: Date;
    position?: { x: number; y: number };
    id?: string;
}

export class StickyNote implements IStickyNote {
    title: string;
    content: string;
    color: string;
    size: string;
    boardId: string;
    createdAt: Date;
    updatedAt: Date;
    position?: { x: number; y: number };
    id?: string;

    constructor(
        title: string,
        content: string,
        color: string,
        size: string,
        boardId: string,
        createdAt: Date,
        updatedAt: Date,
        position?: { x: number; y: number },
        id?: string,
    ) {
        this.title = title;
        this.content = content;
        this.color = color;
        this.position = position;
        this.size = size;
        this.boardId = boardId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.id = id;
    }
}