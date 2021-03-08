const users = require('../api/auth/user-actions');

describe('Test cognito authentication', () => {
  const existingUser = {
    username: 'bypet7@gmail.com',
    password: '1234Abcd$',
  };

  const nonExistingUser = {
    username: 'testuser@gmail.com',
    password: 'noPassword123$',
  };

  test('Try to register an existing user', async () => {
    expect.assertions(1);
    try {
        await users.signUp(
          existingUser.username,
          existingUser.password
        );
    } catch (err){
        expect(err.code).toMatch('UsernameExistsException');
    }
  });

  test('Login with existing user', async () => {
      const token = await users.signIn(
        existingUser.username,
        existingUser.password
      );
      expect(token).toBeTruthy();
  });

  test('Login with non existing user', async () => {
    expect.assertions(1);
    try {
      await users.signIn(
        nonExistingUser.username,
        nonExistingUser.password
      );
    } catch (err) {
      expect(err.code).toMatch('UserNotFoundException');
    }
  });

});
