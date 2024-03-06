exports.up = function (knex) {
    return knex.schema.alterTable('blogs', function (table) {
        table.string('image'); // Add the new 'image' column
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('blogs', function (table) {
        table.dropColumn('image'); // Remove the 'image' column if rolling back
    });
};
