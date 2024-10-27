import express from "express";
import db from "../server/db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/GetAll", async (req, res) => {
    let collection = await db.collection("Trainer");
    let results = await collection.find({}).sort( { "trainerName": 1 } ).toArray();
    res.send(results).status(200);
  });

  router.get("/GetAllNameID", async (req, res) => {
    let collection = await db.collection("Trainer");
    let results = await collection.find({}).sort( { "trainerName": 1 } ).toArray();
    res.send(results).status(200);
  });

  router.get("/GetByID", async (req, res) => {
    let collection = await db.collection("Trainer");
    let id = req.query.id;
    console.log(id)
    let objectId= ObjectId.createFromHexString(id);
    collection.findOne({ "_id": objectId }).then(function(result) {
        console.log(result);
        res.status(200).json({ data: result });
      }
    );  
  });

  router.post("/Insert", async (req, res) => {
    let collection = await db.collection("Trainer");
    let newDocument = req.body;
    console.log(newDocument)
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });

  router.patch("/Update", async (req, res) => {
    let collection = await db.collection("Trainer");
    let updateDocument = req.body;
    console.log(updateDocument);
    const filterQuery = { _id: ObjectId.createFromHexString(req.body._id) };  
    delete updateDocument._id;
    console.log(updateDocument);
    let result = await collection.updateOne(filterQuery, { $set: updateDocument });
    res.send(result).status(200);
  });

  router.delete("/Delete/:id", async (req, res) => {
    let collection = await db.collection("Trainer");
    let id = req.params.id;
    console.log(id)
    const filterQuery = { _id: ObjectId.createFromHexString(id) };  
    let result = await collection.deleteOne(filterQuery);
    res.send(result).status(200);
  });
  export default router;