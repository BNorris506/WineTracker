const client = require("./client");
const { createUser } = require("./models/users");
const { createWine } = require("./models/wine");

async function dropTables() {
  console.log("Starting to drop all tables")
    try{
      await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS wine;
    DROP TABLE IF EXISTS users;
    `);
    console.log("All tables dropped")
    }catch(err){
    console.log("Error dropping tables")
    console.error(err)}
} 

async function createTables() {
  console.log("Starting to create Tables")
  try {
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY, 
      username VARCHAR(255) UNIQUE NOT NULL, 
      password VARCHAR(255) NOT NULL, 
      "isAdmin" BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE wine (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL, 
      type VARCHAR(255) NOT NULL,
      description TEXT NOT NULL, 
      price NUMERIC, 
      url TEXT NOT NULL
    );
    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY, 
      username VARCHAR(255) REFERENCES users(username),
      "wineId" INTEGER REFERENCES wine(id),
      rating NUMERIC NOT NULL,
      description TEXT NOT NULL
    );
    `)
    console.log("Finished creating tables")
  } catch (error) {
    console.log("Error creating tables")
    console.error(error)
  }
}

async function populateInitialData() {
  try {
    const usersToCreate = [
      { username: "Arianna", password: "Arianna123", isAdmin: true },
      { username: "Meghan", password: "Meghan123", isAdmin: true },
      { username: "Brandon", password: "Brandon123", isAdmin: true },
    ];
    const user = await Promise.all(usersToCreate.map(createUser))
    console.log('Users created');
    console.log(user);
    console.log("Finished creating users!")
    const winesToCreate = [
      { name: "Josh", type: "Cabernet Sauvignon", description: "Aromas of ripe black currant, smoke and saddle. Flavors of dark cherry and ripe plum with a hint of vanilla and cocoa", price: 10.47, url: "https://cdn11.bigcommerce.com/s-7a906/images/stencil/1280x1280/products/12320/13772/Josh-Cellars-Cabernet-Sauvignon__68105.1561390140.jpg?c=2" },
      { name: "Vampire", type: "Cabernet Sauvignon", description: "idk. Looks cute", price: 18.99, url: "https://static.wixstatic.com/media/27e270_f4fb69e8db9440a3a18547f85ea194d6~mv2.png/v1/fill/w_1315,h_2210,al_c/27e270_f4fb69e8db9440a3a18547f85ea194d6~mv2.png" },
      { name: "Juggernaut", type: "Cabernet Sauvignon", description: "delicious", price: 16.99, url: "https://bremerswineandliquor.com/wp-content/uploads/2019/03/juggernaut-cabernet.png" },
    ];
    const wine = await Promise.all(winesToCreate.map(createWine))
    console.log('Wines created');
    console.log(wine);
    console.log("Finished creating wines!")
  } catch (error) {
    console.log("error populating initial data")
    throw error
  }
}

async function rebuildDB() {
    try {
      client.connect()
      await dropTables()
      await createTables()
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error
    }
  }

module.exports = {
    rebuildDB,
    populateInitialData
}