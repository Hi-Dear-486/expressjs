import express from "express";
import { Router } from "express";
import { users } from "../../utils/constants.js";
import cookieParser from "cookie-parser";
let router = Router();

let server = express();
router.use(cookieParser());

router.get("/", (req, res) => {
  res.cookie("username", "zeeshan", { maxAge: 24 * 60 * 60 * 1000 });
  res.send("set Cookie");
});

// Rest API to get users
router.get("/api/users", (req, res) => {
  // Always add X- to custom header
  res.setHeader("X-Key", "value");
  const userAgent = req.headers["user-agent"];
  console.log("🚀 ~ router.get ~ userAgent:", userAgent);

  if (!req.cookies) {
    return res
      .status(400)
      .json({ msg: "Cookies are not enabled or accessible" });
  }
  const username = req.cookies["username"]; // 'username' cookie ko get karna

  // If 'username' cookie exists
  if (username) {
    const { filter, value } = req.query;

    const filteredUsers =
      filter && value
        ? users.filter((user) =>
            user[filter]?.toLowerCase().includes(value.toLowerCase())
          )
        : users;

    return res.json(filteredUsers);
  } else {
    return res.status(401).json({ msg: "Sorry: You need the correct cookie" });
  }
});

// Get user by ID
router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === parseInt(id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not Found" });
  }
});

// Post new user
router.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: users.length + 1, ...body };
  users.push(newUser);
  return res.status(201).json(newUser);
});

// Update user (PUT)
router.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  users[findUserIndex] = { id: parseId, ...body };
  return res.sendStatus(200);
});

// Update specific field (PATCH)
router.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  users[findUserIndex] = { ...users[findUserIndex], ...body };
  return res.sendStatus(200);
});

// Delete user
router.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  users.splice(findUserIndex, 1);
  return res.sendStatus(200);
});
export default router;
