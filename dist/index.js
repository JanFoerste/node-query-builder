"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(table) {
        this.fields = [];
        this.whereConditions = [];
        this.operators = [
            '=', '<', '>', '<=', '>=', '<>', '!=',
            'LIKE', 'NOT LIKE', 'REGEXP', 'NOT REGEXP',
            'IS', 'IS NOT'
        ];
        this.table = table;
    }
    // Base methods
    select(fields) {
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
    delete() {
        this.template = 'DELETE';
        return this;
    }
    update() {
        this.template = 'UPDATE';
        return this;
    }
    insert() {
        this.template = 'INSERT';
        return this;
    }
    // Conditions
    where(col, operatorOrVal, val) {
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
    whereColumn(col, operatorOrVal, val) {
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
    andWhere(col, operatorOrVal, val) {
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
    andWhereColumn(col, operatorOrVal, val) {
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
    orWhere(col, operatorOrVal, val) {
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
    orWhereColumn(col, operatorOrVal, val) {
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
    getWhereParameters(args) {
        let operator;
        let value;
        // Has operator key
        if (args.hasOwnProperty(2)) {
            operator = args[1];
            value = args[2];
        }
        else {
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
    checkWhereParameters(operator, value) {
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
    checkOperator(operator) {
        return this.operators.indexOf(operator) > -1;
    }
    /**
     * Check if the operator is allowed for the given value
     *
     * @param {string} operator
     * @param value
     * @returns {boolean}
     */
    checkOperatorAndValue(operator, value) {
        if (value === null) {
            return ['IS', 'IS NOT'].indexOf(operator) > -1;
        }
        else {
            return ['IS', 'IS NOT'].indexOf(operator) === -1;
        }
    }
    getQuery() {
        const regex = new RegExp('{{(\\w+)}}', 'i');
        let match;
        while (match = regex.exec(this.template)) {
            const method = `build${match[1]}`;
            this.template = this.template.replace(match[0], this[method]());
        }
        return this.template.trim();
    }
    buildFields() {
        return this.fields.join(', ').trim();
    }
    buildTable() {
        return this.table;
    }
    buildWhere() {
        let result = '';
        for (let i = 0; i < this.whereConditions.length; i++) {
            if (!this.whereConditions.hasOwnProperty(i)) {
                continue;
            }
            result = `${result} ${this.whereConditions[i]}`;
        }
        return result.trim();
    }
    buildGroupBy() {
        return '';
    }
    buildHaving() {
        return '';
    }
    buildOrderBy() {
        return '';
    }
    buildLimit() {
        return '';
    }
}
exports.QueryBuilder = QueryBuilder;
