const client = require("../client");

async function createUser({ username, password }) {
    try {
        const {
          rows: [user],
        } = await client.query(
          `
          INSERT INTO users(username, password)
          VALUES($1, $2)
          ON CONFLICT (username) DO NOTHING
          RETURNING username, id;
          `,
          [username, password]
        );
        return user;
    } catch (error) {
      console.error("error creating users");
      throw error;
    }
}

async function getUser({ username, password }) {
    try {
      const _user = await getUserByUsername(username)
      if(password == _user.password){
      const { rows: [user] } = await client.query(
        `
        SELECT username, id
        FROM users
        where username = $1 AND password = $2
        `, [username, password]
      )
      return user}
    } catch (error) {
      console.error("error getting user")
      throw error
    }
  }

  async function getUserByUsername(userName) {
    try {
      const { rows: [user] } = await client.query(
        `
        SELECT * 
        FROM users
        WHERE username=$1`
        , [userName]
      );
      return user
    } catch (error) {
      console.error("error getting user by username");
      throw error;
    }
  }

  async function getUserById(id) {
    try {
      const { rows: [ user ] } = await client.query(
        `SELECT *
        FROM users
        WHERE username=$1`
        , [id]
      );
      return user
    } catch (error) {
      console.log("error getting user by id")
      throw error;
    }
  }

module.exports = {
    createUser,
    getUser,
    getUserByUsername,
    getUserById
  };