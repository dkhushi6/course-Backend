const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 4007;
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
app.use(cors());

//connecting MDB--
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected ");
  } catch (error) {
    console.error(`error:${error.message}`);
  }
};

connectDB();
// user model and schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// add product model and schema
const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  amount: Number,
  duration: String,
});

const Course = mongoose.model("Course", courseSchema);

//add purchase model and schema
const purchaseSchema = new mongoose.Schema({
  userID: String,
  courseID: String,
  quantity: Number,
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

//add see all courses model and schema

app.post("/signup", async (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "enter all details!!!!!" });
  }
  const userEx = await User.findOne({ email });
  if (userEx) {
    return res.json({ message: "email already exist!" });
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  return res.json({ message: "User created successfully :)))", user });
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email || !password) {
    return res.json({ message: "enter all details!!!!!" });
  }
  const userNew = await User.findOne({ email, password });
  if (!userNew) {
    return res.json({ message: "the user doesn't exist :(" });
  }
  if (userNew) {
    return res.json({ message: "login successfull !!!!!!!!!!" });
  }
});

app.post("/addcourse", async (req, res) => {
  const { name } = req.body;
  const { description } = req.body;
  const { amount } = req.body;
  const { duration } = req.body;

  if (!name || !description || !amount || !duration) {
    return res.json({ message: "enter all details!!!!!" });
  }
  const course = await Course.create({
    name,
    description,
    amount,
    duration,
  });
  return res.json({ message: "course created successfully!!!!!", course });
});

app.post("/purchase", async (req, res) => {
  const { userID } = req.body;
  const { courseID } = req.body;
  const { quantity } = req.body;
  console.log("u", userID);
  console.log("c", courseID);
  console.log("q", quantity);
  if (!userID || !courseID || !quantity) {
    return res.json({ message: "enter all details!!!!!" });
  }

  const purUser = await User.findOne({ _id: userID });
  const purCourse = await Course.findOne({ _id: courseID });
  if (!purCourse) {
    return res.json({ message: "product not found !" });
  }
  if (!purUser) {
    return res.json({ message: "user not found !" });
  }

  if (purCourse || purUser) {
    const purchase = await Purchase.create({
      userID,
      courseID,
      quantity,
    });
    return res.json({
      message: "product purchase successfully!!!!!",
      purchase,
    });
  }
});

app.get("/seecourses", async (req, res) => {
  const allCourse = await Course.find();
  console.log(allCourse);
  return res.json({
    message: "all courses are displayed down here---->",
    allCourse,
  });
});

app.post("/getuser", async (req, res) => {
  const { uid } = req.headers;
  console.log(uid);
  const userDetail = await User.findOne({ _id: uid });
  console.log(userDetail);
  if (!userDetail) {
    return res.json({
      message: "user not found",
    });
  }
  if (userDetail) {
    return res.json({
      message: "user located successfully and here are its details",
      user: userDetail,
    });
  }
});

app.post("/userpurchases", async (req, res) => {
  const { idUser } = req.body;
  const coursebuyuser = await Purchase.find();
  if (!coursebuyuser) {
    return res.json({
      message: "user not found",
    });
  }
  if (!coursebuyuser) {
    return res.json({
      message: "user dont exist",
    });
  }
  if (coursebuyuser) {
    return res.json({
      message: "here are the purchases for the user----",
      purchase: coursebuyuser,
    });
  }
});

app.post("/changepass", async (req, res) => {
  const { email } = req.body;
  var { password } = req.body;
  var { newPassword } = req.body;
  const oldInfo = await User.findOne({ email, password });
  if (!oldInfo) {
    return res.json({ message: "email and password didn't match" });
  }
  if (oldInfo) {
    oldInfo.password = newPassword;
    oldInfo.save();
    return res.json({
      message: "Password changed successfully!",
      user: oldInfo,
    });
  }
});
app.post("/changeEmail", async (req, res) => {
  var { email } = req.body;
  const { password } = req.body;
  var { newEmail } = req.body;
  const oldEmail = await User.findOne({ email, password });
  if (!oldEmail) {
    return res.json({ message: "email and password didn't match" });
  }
  if (oldEmail) {
    oldEmail.email = newEmail;
    oldEmail.save();
    return res.json({
      message: "Email changed successfully!",
      user: oldEmail,
    });
  }
});

app.post("/changecourse", async (req, res) => {
  const { cID } = req.body;
  var { newName } = req.body;
  var { newDescription } = req.body;
  var { newAmount } = req.body;
  var { newDuration } = req.body;
  const oldCourse = await Course.findOne({ _id: cID });
  if (oldCourse) {
    oldCourse.name = newName;
    oldCourse.description = newDescription;
    oldCourse.duration = newDuration;
    oldCourse.amount = newAmount;
    oldCourse.save();
    return res.json({
      message: "course modified successfully!",
      course: oldCourse,
    });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
