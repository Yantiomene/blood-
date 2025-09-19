/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('conversations', function(table) {
        table.increments('id').primary();
        table.integer('senderId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('receiverId').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
};
        table.increments('id').primary();
        table.integer('senderId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('receiverId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.timestamps(true, true);
        // Add indexes for foreign keys
        table.index(['senderId']);
        table.index(['receiverId']);
        // Add unique constraint to prevent duplicate conversations
        table.unique(['senderId', 'receiverId']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('conversations');
};
