const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const md5 = require('md5');
const userService = require('../../services/userService');

describe.only('Testing userService', () => {
  const fakeUsers = [
    {
      email: 'urtubeycarlos.0510@gmail.com',
      password: 'abcd',
    },
    {
      email: 'john.doe@gmail.com',
      password: '1234',
    },
    {
      email: 'carlosu@avalith.net',
      password: 'abc123',
    },
  ];

  beforeEach(async () => {
    for (let i = 0; i < fakeUsers.length; i += 1) {
      const user = fakeUsers[i];
      await userService.insert(user);
    }
  });

  afterEach(async () => {
    for (let i = 0; i < fakeUsers.length; i += 1) {
      const user = fakeUsers[i];
      await userService.remove(user);
    }
  });

  describe('main methods', () => {
    it('getAll', async () => {
      const result = await userService.getAll();
      assert.strictEqual(result.length, 3);
    });

    it('get', async () => {
      const result = await userService.get(fakeUsers[0]);
      assert.strictEqual(result.email, fakeUsers[0].email);
      assert.strictEqual(result.password, md5(fakeUsers[0].password));
    });

    it('insert', async () => {
      const newUser = {
        email: 'jane.doe@outlook.com',
        password: '123abc',
      };
      await userService.insert(newUser);
      const dbContent = await userService.getAll();
      assert.strictEqual(dbContent.length, 4);
      await userService.remove(newUser);
    });

    it('update', async () => {
      const newData = {
        email: 'urtubeycarlos.0510@gmail.com',
        password: 'abcd',
        newPassword: '1234',
      };
      await userService.update(newData);
      const toGet = {
        email: newData.email,
        password: newData.newPassword,
      };
      const updated = await userService.get(toGet);
      assert.strictEqual(updated.email, fakeUsers[0].email);
      assert.notStrictEqual(updated.password, md5(fakeUsers[0].password));
      const toRestore = {
        email: fakeUsers[0].email,
        password: newData.newPassword,
        newPassword: fakeUsers[0].password,
      };
      await userService.update(toRestore);
    });

    it('remove', async () => {
      await userService.remove(fakeUsers[0]);
      const result = await userService.getAll();
      assert.strictEqual(result.length, 2);
    });
  });
});
