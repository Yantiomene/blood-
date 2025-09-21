exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('donation_requests').del();

  // Ensure we have a valid user id (from 01_users_seed.js)
  const user = await knex('users').select('id').where({ email: 'john@example.com' }).first();
  if (!user || !user.id) {
    throw new Error('Required user with email john@example.com not found. Ensure 01_users_seed.js runs first.');
  }
  const userId = user.id;

  // Insert seed entries (avoid invalid FK for requestingEntityId; it references users table by migration)
  return knex('donation_requests').insert([
    {
      userId, // FK to users table
      bloodType: 'B-',
      quantity: 2,
      location: knex.raw("ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)"), // Example: NYC
      isFulfilled: false,
      requestingEntity: 'Hospital',
      requestingEntityId: null,
    },
  ]);
};