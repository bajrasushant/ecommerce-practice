// this is controller for normal users
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const user = await User.find({});
  response.json(user);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password, email, phone, address, isAdmin, isMod } =
    request.body;
  if (
    !username ||
    !password ||
    username.trim() === "" ||
    password.trim() === ""
  ) {
    return response
      .status(401)
      .json({ error: "username and password both required" });
  }

  if (!(username.length >= 3 && password.length >= 3)) {
    return response
      .status(401)
      .json({
        error: "username and password should contain atleast 3 characters",
      });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    address,
    email,
    phone,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

module.exports = userRouter;
