export class QueryBuilder
{

  private mode: string;

  public select() {
    this.mode = 'SELECT'
  }

  public delete() {
    this.mode = 'DELETE'
  }

  public update() {
    this.mode = 'UPDATE'
  }

  public insert() {
    this.mode = 'INSERT INTO'
  }

}