const bcrypt = require('bcrypt');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'john_doe',
          email: 'john@example.com',
          password: bcrypt.hashSync('password', 10),
          bloodType: 'A+',
          location: null,
          contactNumber: '123456789',
          isDonor: true,
          isHospital: false,
          isBloodBank: false,
          isBloodCamp: false,
          associatedEntityId: null,
          isVerified: true,
        },
        // Add more user entries as needed
      ]);
    });
};