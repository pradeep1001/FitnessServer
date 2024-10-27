import express from "express";
import db from "../server/db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();

// Get all members
router.get("/GetAll", async (req, res) => {
    try {
        let collection = await db.collection("Member");
        let results = await collection.find({}).sort({ "userName": 1 }).toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get member by ID
router.get("/GetByID", async (req, res) => {
    try {
        let collection = await db.collection("Member");
        let id = req.query.id;
        let objectId = ObjectId.createFromHexString(id);
        const result = await collection.findOne({ "_id": objectId });
        
        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Insert new member
router.post("/Insert", async (req, res) => {
    try {
        let collection = await db.collection("Member");
        let newDocument = req.body;
        let result = await collection.insertOne(newDocument);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update member
router.patch("/Update/:id", async (req, res) => {
    try {
        let collection = await db.collection("Member");
        const id = req.params.id;
        let updateDocument = req.body;
        
        const filterQuery = { _id: ObjectId.createFromHexString(id) };
        delete updateDocument._id; // Remove _id from update document
        
        let result = await collection.updateOne(filterQuery, { $set: updateDocument });
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete member
router.delete("/Delete/:id", async (req, res) => {
    try {
        let collection = await db.collection("Member");
        let id = req.params.id;
        const filterQuery = { _id: ObjectId.createFromHexString(id) };
        
        let result = await collection.deleteOne(filterQuery);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;