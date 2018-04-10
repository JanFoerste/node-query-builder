import {isUndefined} from "util";

export class QueryBuilder {

    private template: string;

    private fields: string[] = [];

    private table: string;

    private whereConditions = [];

    private operators = [
        '=', '<', '>', '<=', '>=', '<>', '!=',
        'LIKE', 'NOT LIKE', 'REGEXP', 'NOT REGEXP',
        'IS', 'IS NOT'
    ];

    constructor(table: string) {
        this.table = table;
    }

    // Base methods
    public select(fields: string[]): this {
        this.template = 'SELECT ' +
            '{{Fields}} ' +
            'FROM {{Table}} ' +
            '{{Where}} ' +
            '{{GroupBy}} ' +
            '{{Having}} ' +
            '{{OrderBy}} ' +
            '{{Limit}}';

        this.fields = fields;
        return this;
    }

    public delete(): this {
        this.template = 'DELETE';
        return this;
    }

    public update(): this {
        this.template = 'UPDATE';
        return this;
    }

    public insert(): this {
        this.template = 'INSERT';
        return this;
    }

    // Conditions

    public where(col: string, operatorOrVal: any, val?: any): this {

        /*
         * If there already is a where condition,
         * we assume that andWhere is required
         */
        if (this.whereConditions.length > 0) {
            return this.andWhere(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.checkWhereParameters(operator, value);
        this.whereConditions.push(`WHERE ${col} ${operator} ${value}`);
        return this;
    }

    public whereColumn(col: any, operatorOrVal?: string, val?: any): this {
        /*
         * If there already is a where condition,
         * we assume that andWhere is required
         */
        if (this.whereConditions.length > 0) {
            return this.andWhereColumn(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.whereConditions.push(`WHERE ${col} ${operator} ${value}`);
        return this;
    }

    public andWhere(col: any, operatorOrVal?: string, val?: any): this {
        /*
         * If there is no where condition yet,
         * we assume that a simple where is required
         */
        if (this.whereConditions.length < 1) {
            return this.where(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.checkWhereParameters(operator, value);
        this.whereConditions.push(`AND ${col} ${operator} ${value}`);
        return this;
    }

    public andWhereColumn(col: any, operatorOrVal?: string, val?: any): this {
        /*
         * If there is no where condition yet,
         * we assume that a simple where is required
         */
        if (this.whereConditions.length < 1) {
            return this.whereColumn(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.whereConditions.push(`AND ${col} ${operator} ${value}`);
        return this;
    }

    public orWhere(col: any, operatorOrVal?: string, val?: any): this {
        /*
         * If there is no where condition yet,
         * we assume that a simple where is required
         */
        if (this.whereConditions.length < 1) {
            return this.where(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.checkWhereParameters(operator, value);
        this.whereConditions.push(`OR ${col} ${operator} ${value}`);
        return this;
    }

    public orWhereColumn(col: any, operatorOrVal?: string, val?: any): this {
        /*
         * If there is no where condition yet,
         * we assume that a simple where is required
         */
        if (this.whereConditions.length < 1) {
            return this.whereColumn(col, operatorOrVal, val);
        }

        const [operator, value] = this.getWhereParameters(arguments);
        this.whereConditions.push(`OR ${col} ${operator} ${value}`);
        return this;
    }

    private getWhereParameters(args: IArguments): [string, any] {
        let operator: string;
        let value: any;

        // Has operator key
        if (args.hasOwnProperty(2)) {
            operator = args[1];
            value = args[2];
        } else {
            // Assume that the user wanted to use =
            operator = '=';
            value = args[1];
        }

        return [operator, value];
    }

    /**
     * Validate where parameters
     *
     * @param {string} operator
     * @param value
     * @throws Error
     */
    private checkWhereParameters(operator: string, value: any) {
        if (!this.checkOperator(operator)) {
            throw new Error(`Invalid WHERE operator: ${operator}!`);
        }

        if (!this.checkOperatorAndValue(operator, value)) {
            throw new Error(`Invalid WHERE operator '${operator}' for value '${value}'`);
        }
    }

    /**
     * Check if the operator is valid
     *
     * @param {string} operator
     * @returns {boolean}
     */
    private checkOperator(operator: string) {
        return this.operators.indexOf(operator) > -1;
    }

    /**
     * Check if the operator is allowed for the given value
     *
     * @param {string} operator
     * @param value
     * @returns {boolean}
     */
    private checkOperatorAndValue(operator: string, value: any) {
        if (value === null) {
            return ['IS', 'IS NOT'].indexOf(operator) > -1;
        } else {
            return ['IS', 'IS NOT'].indexOf(operator) === -1;
        }
    }

    public getQuery() {
        const regex = new RegExp('{{(\\w+)}}', 'i');
        let match: RegExpExecArray;

        while (match = regex.exec(this.template)) {
            const method = `build${match[1]}`;
            this.template = this.template.replace(match[0], this[method]());
        }

        return this.template.trim();
    }

    private buildFields() {
        return this.fields.join(', ').trim();
    }

    private buildTable() {
        return this.table;
    }

    private buildWhere() {
        let result = '';

        for (let i = 0; i < this.whereConditions.length; i++) {
            if (!this.whereConditions.hasOwnProperty(i)) {
                continue;
            }

            result = `${result} ${this.whereConditions[i]}`;
        }

        return result.trim();
    }

    private buildGroupBy() {
        return '';
    }

    private buildHaving() {
        return '';
    }

    private buildOrderBy() {
        return '';
    }

    private buildLimit() {
        return '';
    }

}