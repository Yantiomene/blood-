exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('blood_banks').del()
      .then(function () {
        // Inserts seed entries
        return knex('blood_banks').insert([
          {
            id: 1,
            name: 'Local Blood Bank',
            location: knex.raw("ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)"), // Example: NYC
            contactNumber: '876543210',
          },
          // Add more blood bank entries as needed
        ]);
    });
};