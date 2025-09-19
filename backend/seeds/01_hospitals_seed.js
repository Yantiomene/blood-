exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('hospitals').del()
      .then(function () {
        // Inserts seed entries
        return knex('hospitals').insert([
          {
            name: 'City Hospital',
            location: knex.raw("ST_SetSRID(ST_MakePoint(0,0), 4326)"),
            contactNumber: '987654321',
          },
          // Add more hospital entries as needed
        ]);
    });
};