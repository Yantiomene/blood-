/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('conversations', function(table) {
        table.increments('id').primary();
        table.integer('senderId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('receiverId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('conversations');
};
