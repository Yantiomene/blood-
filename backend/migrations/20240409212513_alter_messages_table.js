/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('messages', function(table) {
        table.string('messageType').notNullable().defaultTo('text'); // Message type: text, image, video, etc.
        table.string('status').notNullable().defaultTo('sent'); // Message status: sent, delivered, read, failed, etc.
        table.integer('conversationId').unsigned().references('id').inTable('conversations').onDelete('CASCADE'); // Conversation ID
        table.json('metadata'); // Additional message metadata
        table.string('event'); // Event associated with the message, such as user_typing, user_joined, user_left, etc.
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('messages', function(table) {
        table.dropColumn('messageType');
        table.dropColumn('status');
        table.dropColumn('conversationId');
        table.dropColumn('metadata');
        table.dropColumn('event');
    });
};
