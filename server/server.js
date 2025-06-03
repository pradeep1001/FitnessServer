import express from "express";
import cors from "cors";
import fitnesstype from "../routes/FitnessType.js";
import users from "../routes/Users.js";
import member from "../routes/Member.js";
import trainer from "../routes/Trainer.js";
import fitnessclass from "../routes/FitnessClass.js";
import booking from "../routes/Booking.js";
import trainerasset from "../routes/TrainerAsset.js";
import classschedule from "../routes/ClassSchedule.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/FitnessType", fitnesstype);
app.use("/api/Users", users);
app.use("/api/Member", member);
app.use("/api/Trainer", trainer);
app.use("/api/FitnessClass", fitnessclass);
app.use("/api/Booking", booking);
app.use("/api/ClassSchedule", classschedule);
app.use("/api/TrainerAsset", trainerasset);

app.get('/', (req, res) => {
    res.send('Welcome to the Fitness Server!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});