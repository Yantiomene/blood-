/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('hospitals', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.specificType('location', 'POINT').notNullable();
        table.string('contactNumber');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('hospitals');
};