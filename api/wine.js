const express = require("express");
const { getReviewsByWineId } = require("../db/models/reviews");
const wineRouter = express.Router();
const {
    createWine, 
    getAllWines,
    getWineById, 
    updateWine, 
    deleteWine
} = require("../db/models/wine");
const {requireUser} = require("./utils"
)

// GET /api/wine
wineRouter.get("/", async (req, res, next) => {
    try {
      const wines = await getAllWines();
      res.send(wines);
    } catch (error) {
      next(error);
    }
  });

  // GET /api/wine/:wineId
wineRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
      const wine = await getWineById(id) 
      const review = await getReviewsByWineId(id)
      res.send([wine, review]);
  } catch (error) {
    next(error)
  }
})

// POST /api/wine
wineRouter.post("/", requireUser, async (req, res, next) => {
    const {name, type, description, price, url} = req.body
    try {
      const wine = await createWine(name, type, description, price, url);
      if( wine ){
        res.send({ wine });
      }
    } catch (error) {
      next(error);
    }
  });
// PATCH /api/wine/:wineId
wineRouter.patch("/:wineId", requireUser, async (req, res, next) => {
    const { id } = req.params
    const { name, type, description, price, url} = req.body

    const updateFields = {}

    if (name){
        updateFields.name = name
    }

    if (type){
        updateFields.type = type
    }
    if (description){
        updateFields.description = description
    }

    if (price){
        updateFields.price = price
    }

    if (url){
      updateFields.url = url
    }

    try {
        const updatedWine = await updateWine(id, updateFields);
          res.send({ wine: updatedWine })
    } catch (error) {
      next(error);
    }
  });

// DELETE /api/wine/:wineId
wineRouter.delete("/:wineId", async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedWine = await deleteWine(id) 
        res.send(deletedWine)
    } catch (error) {
      next(error)
    }
})

module.exports = wineRouter;

