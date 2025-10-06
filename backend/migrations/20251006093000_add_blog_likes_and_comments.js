exports.up = async function(knex) {
  // Add likes_count to blogs
  const hasLikes = await knex.schema.hasColumn('blogs', 'likes_count');
  if (!hasLikes) {
    await knex.schema.table('blogs', (table) => {
      table.integer('likes_count').defaultTo(0);
    });
  }

  // Create blog_comments table
  const exists = await knex.schema.hasTable('blog_comments');
  if (!exists) {
    await knex.schema.createTable('blog_comments', (table) => {
      table.increments('id').primary();
      table.integer('blog_id').notNullable().references('id').inTable('blogs').onDelete('CASCADE');
      table.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function(knex) {
  const hasComments = await knex.schema.hasTable('blog_comments');
  if (hasComments) {
    await knex.schema.dropTable('blog_comments');
  }

  const hasLikes = await knex.schema.hasColumn('blogs', 'likes_count');
  if (hasLikes) {
    await knex.schema.table('blogs', (table) => {
      table.dropColumn('likes_count');
    });
  }
};