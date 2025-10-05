exports.up = function(knex) {
  return knex.schema.createTable('donation_acceptances', function(table) {
    table.increments('id').primary();
    table.integer('requestId').unsigned().notNullable().references('donation_requests.id').onDelete('CASCADE');
    table.integer('donorId').unsigned().notNullable().references('users.id').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['requestId', 'donorId']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('donation_acceptances');
};