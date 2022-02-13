import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rooms extends BaseSchema {
  protected tableName = 'rooms'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('game_data').notNullable().defaultTo('{}')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('game_data')
    })
  }
}
