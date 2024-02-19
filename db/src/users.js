db.createCollection('users');

db.users.insertMany([
  {
    username: 'matteo.collina',
    password:
      '1f4657a571bd2c494b8ae447798527a1.6821fcc8c228b7bbea6ed3dde76510099ed1b95bcbdb5b7dfb297f125509ed8b05c027ef80d99571d2ec02bbe6cb73f6868e26319d7f4e7576ed464767eda195',
    email: 'matteo.collina@example.com',
    fullName: 'Matteo Collina',
    status: true,
    secret: null,
    otpEnabled: false,
    otpVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    username: 'shyam.chen',
    password:
      '670945309327b221f1e80d12830c7ea2.bec48efc65cc675ce3081da73feeb3b49b4ef17f1fb80a4c77a63016a836c9284924edb629e46cde2ef4a378a859ab79c5c9671554c752a158b8c0188a5019be',
    email: 'shyam.chen@example.com',
    fullName: 'Shyam Chen',
    status: true,
    secret: null,
    otpEnabled: false,
    otpVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);
