/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
        ALTER TABLE donation_requests
        ALTER COLUMN location TYPE geometry(Point, 4326)
        USING ST_SetSRID(location, 4326);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(`
        ALTER TABLE donation_requests
        ALTER COLUMN location TYPE geometry(Point)
        USING ST_Force2D(location);
    `);
};
