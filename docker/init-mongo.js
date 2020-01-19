db.createUser({
  user: 'rootuser',
  pwd: 'supersecurepassword',
  roles: [
    {
      role: 'readWrite',
      db: 'usersdb',
    },
    {
      role: 'dbOwner',
      db: 'usersdb',
    },
  ],
});
