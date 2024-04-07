/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTable('denial_reasons', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().references('users.id');
      table.integer('requestId').unsigned().references('donation_requests.id');
      table.text('reason').notNullable();
      table.timestamps(true, true);
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('denial_reasons');
};
