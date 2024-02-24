/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('messages', function (table) {
        table.increments('id').primary();
        table.integer('senderId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('recipientId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.text('content').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('messages');
};
