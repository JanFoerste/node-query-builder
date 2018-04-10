export declare class QueryBuilder {
    private template;
    private fields;
    private table;
    private whereCondition;
    constructor(table: string);
    select(fields: string[]): this;
    delete(): this;
    update(): this;
    insert(): this;
    where(value: any, compare: any): this;
    where(value: any, operator: string, compare: any): this;
    andWhere(value: any, compare: any): void;
    andWhere(value: any, operator: string, compare: any): void;
    orWhere(value: any, compare: any): void;
    orWhere(value: any, operator: string, compare: any): void;
    private getWhereStatement(value, compare);
    private getWhereStatement(value, operator, compare);
    getQuery(): string;
    private buildFields();
    private buildTable();
    private buildWhere();
    private buildGroupBy();
    private buildHaving();
    private buildOrderBy();
    private buildLimit();
}
