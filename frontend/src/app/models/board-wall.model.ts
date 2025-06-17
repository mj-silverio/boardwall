export interface IBoardWall {
    id: number;
    name: string;
    sharedAccounts: [string];
    description: string;
    userAccountId: number;
    createdAt: Date;
    updatedAt: Date;
}