import express from "express";
import next from "next";
import winston from "winston";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Winston Logger Setup
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
    transports: [
      // Console output
      // new winston.transports.Console(),
      // Log to file
      new winston.transports.File({ filename: "logs/app.log" }),
    ],
  });

  // Middleware to log requests
  server.use((req, res, next) => {
    logger.info(`Received ${req.method} request for: ${req.url}`); // Log with Winston
    next();
  });

  // Middleware to parse JSON bodies
  server.use(express.json());

  const users = [
    { id: 1, name: "Muhammad Zeeshan", Degree: "BSSE" },
    { id: 2, name: "Muhammad Tayyab Tahir", Degree: "Civil Engineering" },
    { id: 3, name: "Muhammad Shair", Degree: "BBA" },
  ];

  // Rest API to get users
  server.get("/api/users", (req, res) => {
    const { filter, value } = req.query;
    res.json(
      filter && value
        ? users.filter((user) =>
            user[filter]?.toLowerCase().includes(value.toLowerCase())
          )
        : users
    );
  });

  // Get user by ID
  server.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  });

  // Post new user
  server.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);
    return res.status(201).json(newUser);
  });

  // Update user (PUT)
  server.put("/api/users/:id", (req, res) => {
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
  server.patch("/api/users/:id", (req, res) => {
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
  server.delete("/api/users/:id", (req, res) => {
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

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
