import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoomUsers extends BaseSchema {
  protected tableName = 'room_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('room_id').unsigned().index().references('id').inTable('rooms')
      table.bigInteger('user_id').unsigned().index().references('id').inTable('users')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
