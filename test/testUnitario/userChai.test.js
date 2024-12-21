import mongoose from "mongoose";
import chai from 'chai';
import User from '../../src/dao/Users.dao.js';
import { config } from 'dotenv';

config();
const expect = chai.expect;
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
    expect(Array.isArray(result)).to.be.true;
  });

  it('DAO can add a new user to DB', async function () {
    let user = {
      first_name: 'Patricio',
      last_name: 'Pittana',
      email: 'pittanapatricio@gmail.com',
      password: 1234,
      role: 'admin',
    };

    const result = await this.userDAO.save(user);
    expect(result).to.have.property('_id');

  });

  it('Validate the user have a pets empty array', async function () {
    let user = {
      first_name: 'Angel',
      last_name: 'Pittana',
      email: 'patipita@gmail.com',
      password: 1234,
      role: 'user',
    };

    const result = await this.userDAO.save(user);
    expect(result.pets).to.be.deep.equal([]);
  });

  it('GET user by email', async function () {
    let user = {
      first_name: 'Patricio',
      last_name: 'Pittana',
      email: 'pittanapatricio@gmail.com',
      password: 1234,
      role: 'admin',
    };

    const result = await this.userDAO.save(user);
    const userByEmail = await this.userDAO.getBy({email: result.email});
    expect(userByEmail).to.be.an('Object');
  });

  after(() => {
    mongoose.connection.close();
  });
});
