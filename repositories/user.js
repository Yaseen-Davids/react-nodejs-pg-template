const knex = require("../knex");

const bcrypt = require("bcryptjs");
const uuidv4 = require("uuidv4");

const GetUserByUsername = async (username) => {
  try {
    return await knex("users").first("*").where({ username: username });
  } catch (error) {
    return error;
  }
};

const GetUserById = async (id) => await knex("users").first({ id: "id", username: "username", email: "email" }).where("id", id);

const GetUserByToken = async (token) => await knex("users").first({ id: "id", username: "username", email: "email", token: "token" }).where({ token });

const checkTokenExists = async (id) => await knex("users").first({ token: "token" }).where("id", id);

const CreateUser = async (person) => {
  const token = uuidv4.uuid();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(person.password, salt);
  const tokenHash = await bcrypt.hash(token, salt);

  const user = await knex("users")
    .insert({
      username: person.username,
      email: person.email,
      password: passwordHash,
      token: tokenHash,
    })
    .returning("*");

  return user;
};

const updateUserTokenById = async (id, token) => await knex("users").update({ token: token }).where("id", id);

module.exports = {
  GetUserByUsername,
  GetUserById,
  CreateUser,
  updateUserTokenById,
  GetUserByToken,
  checkTokenExists,
};
