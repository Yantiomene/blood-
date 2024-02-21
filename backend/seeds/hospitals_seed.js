exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('hospitals').del()
      .then(function () {
        // Inserts seed entries
        return knex('hospitals').insert([
          {
            id: 1,
            name: 'City Hospital',
            location: knex.raw('POINT(0,0)'),
            contactNumber: '987654321',
          },
          // Add more hospital entries as needed
        ]);
    });
};
