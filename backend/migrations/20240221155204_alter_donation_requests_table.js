/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw('ALTER TABLE "donation_requests" DROP COLUMN IF EXISTS "location"')
    .then(() => {
        // Add the "location" column with the desired type
        return knex.schema.raw('ALTER TABLE "donation_requests" ADD COLUMN "location" geometry(Point)');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw('ALTER TABLE "donation_requests" DROP COLUMN IF EXISTS "location"')
    .then(() => {
        // Add the "location" column with the original type (point)
        return knex.schema.raw('ALTER TABLE "donation_requests" ADD COLUMN "location" point');
    });
};
