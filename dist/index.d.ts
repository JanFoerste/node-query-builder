export declare class QueryBuilder {
    private template;
    private fields;
    private table;
    private whereConditions;
    private operators;
    constructor(table: string);
    select(fields: string[]): this;
    delete(): this;
    update(): this;
    insert(): this;
    where(col: string, operatorOrVal: any, val?: any): this;
    whereColumn(col: any, operatorOrVal?: string, val?: any): this;
    andWhere(col: any, operatorOrVal?: string, val?: any): this;
    andWhereColumn(col: any, operatorOrVal?: string, val?: any): this;
    orWhere(col: any, operatorOrVal?: string, val?: any): this;
    orWhereColumn(col: any, operatorOrVal?: string, val?: any): this;
    private getWhereParameters(args);
    /**
     * Validate where parameters
     *
     * @param {string} operator
     * @param value
     * @throws Error
     */
    private checkWhereParameters(operator, value);
    /**
     * Check if the operator is valid
     *
     * @param {string} operator
     * @returns {boolean}
     */
    private checkOperator(operator);
    /**
     * Check if the operator is allowed for the given value
     *
     * @param {string} operator
     * @param value
     * @returns {boolean}
     */
    private checkOperatorAndValue(operator, value);
    getQuery(): string;
    private buildFields();
    private buildTable();
    private buildWhere();
    private buildGroupBy();
    private buildHaving();
    private buildOrderBy();
    private buildLimit();
}
