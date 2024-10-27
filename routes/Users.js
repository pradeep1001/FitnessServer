import express from "express";
import db from "../server/db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/GetAll", async (req, res) => {
    let collection = await db.collection("Users");
    let records = await collection.find({}).sort( { "userName": 1 } ).toArray();
    res.send(records).status(200);
  });

  router.get("/GetAllNameID", async (req, res) => {
    let collection = await db.collection("Users");
    let records = await collection.find({}).sort( { "userName": 1 } ).toArray();
    res.send(records).status(200);
  });

  router.get("/GetByID", async (req, res) => {
    let collection = await db.collection("Users");
    let id = req.query.id;
    console.log(id)
    let objectId= ObjectId.createFromHexString(id);
    collection.findOne({ "_id": objectId }).then(function(result) {
        console.log(result);
        res.status(200).json(result);
      }
    );  
  });

  router.post("/Insert", async (req, res) => {
    let collection = await db.collection("Users");
    let newDocument = req.body;
    newDocument.isActive = true;
    console.log(newDocument)
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });

  router.patch("/Update", async (req, res) => {
    let collection = await db.collection("Users");
    let updateDocument = req.body;
    console.log(updateDocument);
    const filterQuery = { _id: ObjectId.createFromHexString(req.body._id) };  
    delete updateDocument._id;
    console.log(updateDocument);
    let result = await collection.updateOne(filterQuery, { $set: updateDocument });
    res.send(result).status(200);
  });

  router.delete("/Delete/:id", async (req, res) => {
    let collection = await db.collection("Users");
    let id = req.params.id;
    console.log(id)
    const filterQuery = { _id: ObjectId.createFromHexString(id) };  
    let result = await collection.deleteOne(filterQuery);
    res.send(result).status(200);
  });


  router.post("/ValidateLogin", async (req, res) => {
    let collection = await db.collection("Users");
    
    let user = req.body;
    console.log("ValidateLogin Called");
    var myDocument = collection.findOne({'emailid': user.emailid, 'password': user.password}).then(function(result) {
        console.log(result);
        if (result)
         res.status(200).json({ data: "User Found" });
        else
          res.status(404).json({ data: "Not Found" });
      }
    ).catch(function (error) {
      res.status(400).json({ data: error });
      console.error(error)
    });  
  });
  export default router;