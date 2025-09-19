/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('username').unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.enu('bloodType', ['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+']).notNullable();
        table.specificType('location', 'POINT');
        table.string('contactNumber');
        table.boolean('isDonor').defaultTo(false);
        table.boolean('isHospital').defaultTo(false);
        table.boolean('isBloodBank').defaultTo(false);
        table.boolean('isBloodCamp').defaultTo(false);
        table.integer('associatedEntityId').unsigned().references('id').inTable('hospitals').onDelete('SET NULL').nullable();
        table.boolean('isVerified').defaultTo(false);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
