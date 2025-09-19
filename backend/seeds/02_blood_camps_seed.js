exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('blood_camps').del()
      .then(function () {
        // Inserts seed entries
        return knex('blood_camps').insert([
          {
            id: 1,
            name: 'Community Blood Camp',
            location: knex.raw("ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)"), // Example: NYC
            contactNumber: '567890123',
          },
          // Add more blood camp entries as needed
        ]);
    });
};