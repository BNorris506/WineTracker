const client = require("../client");

async function createWine({name, type, description, price, url}){
    try {
        const {
          rows: [wine],
        } = await client.query(
          `
        INSERT INTO wine(name, type, description, price, url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
          [name, type, description, price, url]
        );
        return wine;
      } catch (error) {
        console.error("Error creating wine");
        throw error;
      }
}

async function getAllWines(){
    try {
        const { rows: wines } = await client.query(
            `
            SELECT * 
            FROM wine
            `
        ); return products;
    } catch (error) {
        console.log("Error getting all wines")
        console.error(error)
    }
}

async function getWineById(id){
    try {
        const { rows: wine } = await client.query(`
        SELECT *
        FROM wine
        WHERE id = ${id}
        `);
        return wine;
    } catch (error) {
        console.log("Error getting wine by Id")
        console.error(error)
    }
}

async function updateWine({id, ...fields}){
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
    try {
        const { rows : { wine }} = await client.query(
            `
            UPDATE wine
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `, 
            Object.values(fields)
        );
        return wine;
    } catch (error) {
        console.log("Error updating wine")
        console.error(error)
    }
}

// Probably needs to be updated based on where product is attached?
async function deleteWine(id){
    try {
        const { rows : { wine }} = await client.query(
            `
            DELETE FROM wine
            WHERE id = $1
            `, [id]
        );
        return wine;
    } catch (error) {
        console.log("Error deleting Wine")
        console.error(error)
    }
}

module.exports = {
    createWine, 
    getAllWines,
    getWineById, 
    updateWine, 
    deleteWine
}