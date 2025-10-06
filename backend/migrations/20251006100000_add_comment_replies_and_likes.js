exports.up = async function(knex) {
  const hasParent = await knex.schema.hasColumn('blog_comments', 'parent_id');
  if (!hasParent) {
    await knex.schema.table('blog_comments', (table) => {
      table.integer('parent_id').nullable().references('id').inTable('blog_comments').onDelete('CASCADE');
    });
  }

  const hasLikes = await knex.schema.hasColumn('blog_comments', 'likes_count');
  if (!hasLikes) {
    await knex.schema.table('blog_comments', (table) => {
      table.integer('likes_count').defaultTo(0);
    });
  }
};

exports.down = async function(knex) {
  const hasParent = await knex.schema.hasColumn('blog_comments', 'parent_id');
  if (hasParent) {
    await knex.schema.table('blog_comments', (table) => {
      table.dropColumn('parent_id');
    });
  }

  const hasLikes = await knex.schema.hasColumn('blog_comments', 'likes_count');
  if (hasLikes) {
    await knex.schema.table('blog_comments', (table) => {
      table.dropColumn('likes_count');
    });
  }
};