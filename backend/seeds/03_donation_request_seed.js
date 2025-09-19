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
          location: knex.raw("ST_SetSRID(ST_MakePoint(0,0), 4326)"),
          isFulfilled: false,
          requestingEntity: 'Hospital',
          requestingEntityId: null,
          message: 'Urgent blood donation needed for emergency surgery',
          urgent: true,
        },
        // Add more donation request entries as needed
      ]);
    });
};
  