/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('donation_requests', function(table) {
        table.text('message');
        table.boolean('urgent').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('donation_requests', function(table) {
        table.dropColumn('message');
        table.dropColumn('urgent');
    });
};
