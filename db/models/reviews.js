const client = require('../client');


async function createReview({username, wineId, rating, description}) {
    try {
        const { rows: [newReview] } = await client.query(`
        INSERT INTO reviews (username, "wineId", rating, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [username, wineId, rating, description]);
        return newReview
    } catch (error) {
        throw error;
    }
}


async function getAllReviews() {
    const { rows } = await client.query(`
    SELECT * FROM reviews;
    `)
    return rows;
}


async function getReviewsByWineId(id) {
const { rows } = await client.query(`
SELECT * FROM reviews
WHERE "wineId" = ${id};
`)
return rows;
}


async function getReviewsByTags() {

}

module.exports = {
    createReview,
    getAllReviews,
    getReviewsByWineId
}