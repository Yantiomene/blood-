exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('donation_requests').del()
    .then(function () {
      // Inserts seed entries
      return knex('donation_requests').insert([
        {
          id: 1,
          userId: 1, // User ID from the users table
          bloodType: 'B-',
          quantity: 2,
          location: knex.raw("ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)"), // Example: NYC
          isFulfilled: false,
          requestingEntity: 'Hospital',
          requestingEntityId: null,
        },
        // Add more donation request entries as needed
      ]);
    });
};