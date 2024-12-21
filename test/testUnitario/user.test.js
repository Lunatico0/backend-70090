import mongoose from "mongoose";
import assert from 'assert';
import User from '../../src/dao/Users.dao.js';
import { config } from 'dotenv';

config();

mongoose.connect(process.env.URI)

describe("User Model Test", () => {
  before(function () {
    this.userDAO = new User();
  });

  beforeEach(async function () {
    await mongoose.connection.collections.users.drop();
    this.timeout(5000);
  })

  it('GET users must return an array', async function () {
    const result = await this.userDAO.get();
    assert.strictEqual(Array.isArray(result), true);
  });

  it('DAO can add a new user to DB', async function () {
    let user = {
      first_name: 'Patricio',
      last_name: 'Pittana',
      email: 'pittanapatricio@gmail.com',
      password: 1234,
      role: 'admin',
    }

    const result = await this.userDAO.save(user)
    assert.ok(result._id);
  });

  it('Validate the user have a pets empty array', async function () {
    let user = {
      first_name: 'Angel',
      last_name: 'Pittana',
      email: 'patipita@gmail.com',
      password: 1234,
      role: 'user',
    }

    const result = await this.userDAO.save(user)
    assert.deepStrictEqual(result.pets, []);
  });

  it('GET user by email', async function () {
    let user = {
      first_name: 'Patricio',
      last_name: 'Pittana',
      email: 'pittanapatricio@gmail.com',
      password: 1234,
      role: 'admin',
    }

    const result = await this.userDAO.save(user)
    const userByEmail = await this.userDAO.getBy({email: result.email})
    assert.strictEqual(typeof userByEmail, 'object');

  });

  after(async () => {
    await mongoose.disconnect();
  });
});
