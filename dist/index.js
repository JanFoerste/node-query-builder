"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(table) {
        this.fields = [];
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
    where(value, operatorOrCompare, compare) {
        this.whereCondition = `WHERE ${this.getWhereStatement(value, operatorOrCompare, compare)}`;
        return this;
    }
    andWhere(value, operatorOrCompare, compare) {
        const statement = this.getWhereStatement(value, operatorOrCompare, compare);
    }
    orWhere(value, operatorOrCompare, compare) {
        const statement = this.getWhereStatement(value, operatorOrCompare, compare);
    }
    getWhereStatement(value, operatorOrCompare, compare) {
        let operator;
        let compareValue;
        // Operator is set
        if (compare) {
            operator = operatorOrCompare;
            compareValue = compare;
        }
        else {
            operator = '=';
            compareValue = operatorOrCompare;
        }
        if (typeof compareValue === 'string') {
            compareValue = `'${compareValue}'`;
        }
        switch (operator) {
            case '=':
            case '!=':
            case '<':
            case '>':
            case '<=':
            case '>=':
            case '<=>':
            case 'LIKE':
            case 'NOT LIKE':
                return `${value} ${operator} ${compareValue}`;
            case 'IS':
            case 'IS NOT':
                if (compareValue !== null && typeof compareValue !== 'boolean') {
                    throw new Error('To use IS or IS NOT operators, the compare value has to be a boolean or null!');
                }
                return `${value} ${operator} ${compareValue}`;
            default:
                throw new Error(`Invalid operator: ${operator}!`);
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
        return this.whereCondition;
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
