/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('messages', function(table) {
    table.boolean('is_read').notNullable().defaultTo(false);
    table.index(['is_read']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('messages', function(table) {
    table.dropIndex(['is_read']);
    table.dropColumn('is_read');
  });
};