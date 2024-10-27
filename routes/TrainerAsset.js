import express from "express";
import db from "../server/db/connection.js";
import { ObjectId } from "mongodb";
import multer from "multer";


const router = express.Router();
const storage = multer.diskStorage({
  destination: './trainer_assets/',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

let mupload = multer({ storage: storage });

router.get("/GetAll", async (req, res) => {
    //let collectionFitnessClass = await db.collection("TrainerAsset");
    let results = await db.collection("TrainerAsset").aggregate([
      { 
        $addFields: {
          convertedTrainerId: {$toObjectId: "$trainerID"}
        }
      },
      {
        $lookup: {
          from: "Trainer",
          localField: "convertedTrainerId",
          foreignField: "_id",
          as: "trainer"
        }
      }
    ]).toArray();
    //let results = await collection.find({}).sort( { "trainerAssetFileName": 1 } ).toArray();
    res.send(results).status(200);
  });

  router.get("/GetAllNameID", async (req, res) => {
    let collection = await db.collection("TrainerAsset");
    let results = await collection.find({}).sort( { "trainerAssetFileName": 1 } ).toArray();
    res.send(results).status(200);
  });

  router.get("/GetByID", async (req, res) => {
    let collection = await db.collection("TrainerAsset");
    let id = req.query.id;
    console.log(id)
    let objectId= ObjectId.createFromHexString(id);
    collection.findOne({ "_id": objectId }).then(function(result) {
        console.log(result);
        res.status(200).json({ data: result });
      }
    );  
  });

  router.post("/Insert", mupload.array('assets', 12), async (req, res) => {
    let collection = await db.collection("TrainerAsset");
    let newDocument = req.body;
    console.log(newDocument)
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });

  router.patch("/Update", async (req, res) => {
    let collection = await db.collection("TrainerAsset");
    let updateDocument = req.body;
    console.log(updateDocument);
    const filterQuery = { _id: ObjectId.createFromHexString(req.body._id) };  
    delete updateDocument._id;
    console.log(updateDocument);
    let result = await collection.updateOne(filterQuery, { $set: updateDocument });
    res.send(result).status(200);
  });

  router.delete("/Delete/:id", async (req, res) => {
    let collection = await db.collection("TrainerAsset");
    let id = req.params.id;
    console.log(id)
    const filterQuery = { _id: ObjectId.createFromHexString(id) };  
    let result = await collection.deleteOne(filterQuery);
    res.send(result).status(200);
  });
  export default router;