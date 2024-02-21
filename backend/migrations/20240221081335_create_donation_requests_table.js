/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('donation_requests', function (table) {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.enu('bloodType', ['A', 'B', 'AB', 'O']).notNullable();
        table.integer('quantity').notNullable();
        table.specificType('location', 'POINT').notNullable();
        table.boolean('isFulfilled').defaultTo(false);
        table.enu('requestingEntity', ['User', 'Hospital', 'BloodBank', 'BloodCamp']).notNullable();
        table.integer('requestingEntityId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('donation_requests');
};
