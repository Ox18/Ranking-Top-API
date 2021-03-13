export type ITop = {
    numberOfAccounts :number;
    rank: number;
    position: number;
    gp: number;
};

export type Request = {
    query: ITop;
}