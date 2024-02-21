/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('ratings', function (table) {
        table.increments('id').primary();
        table.integer('ratedUserId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('ratedByUserId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('rating').notNullable();
        table.text('feedback');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('ratings');
};
