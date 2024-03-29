exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('blood_camps').del()
      .then(function () {
        // Inserts seed entries
        return knex('blood_camps').insert([
          {
            id: 1,
            name: 'Community Blood Camp',
            location: knex.raw('POINT(0,0)'),
            contactNumber: '567890123',
          },
          // Add more blood camp entries as needed
        ]);
    });
};
