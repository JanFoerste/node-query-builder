export class QueryBuilder
{

  private template: string;

  private fields: string[] = [];

  private table: string;

  private whereCondition: string;

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

  public where(column: any, operatorOrValue?: string, value?: any): this {
    this.whereCondition = `WHERE ${this.getWhereStatement(value, operatorOrValue, value)}`;
    return this;
  }

  public whereColumn(column: any, operatorOrValue?: string, value?: any): this {
    this.whereCondition = `WHERE ${this.getWhereStatement(value, operatorOrValue, `\`${value}\``)}`;
    return this;
  }

  public andWhere(column: any, operatorOrValue?: string, value?: any): void {
    const statement = this.getWhereStatement(value, operatorOrValue, value);
  }

  public andWhereColumn(column: any, operatorOrValue?: string, value?: any): void {
    const statement = this.getWhereStatement(value, operatorOrValue, value);
  }

  public orWhere(column: any, operatorOrValue?: string, value?: any): void {
    const statement = this.getWhereStatement(value, operatorOrValue, value);
  }

  public orWhereColumn(column: any, operatorOrValue?: string, value?: any): void {
    const statement = this.getWhereStatement(value, operatorOrValue, value);
  }

  publich checkOperatorAndValue(operator: value)

  private getWhereStatement(column: any, operatorOrValue?: string, value?: any): string {



    let operator: string;
    let compareValue: any;

    // Operator is set
    if (value) {
      operator     = operatorOrValue;
      compareValue = value;
    } else {
      operator     = '=';
      compareValue = operatorOrValue;
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
          throw new Error(
            'To use IS or IS NOT operators, the compare value has to be a boolean or null!');
        }
        return `${value} ${operator} ${compareValue}`;
      default:
        throw new Error(`Invalid operator: ${operator}!`);
    }
  }

  public getQuery() {
    const regex = new RegExp('{{(\\w+)}}', 'i');
    let match: RegExpExecArray;

    while (match = regex.exec(this.template)) {
      const method  = `build${match[1]}`;
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
    return this.whereCondition;
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