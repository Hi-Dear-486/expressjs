// server.js
import express, { response } from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  const users = [
    { id: 1, name: "Muhammad Zeeshan", Degree: "BSSE" },
    { id: 2, name: "Muhammad Tayyab Tahir", Degree: "Civil Engineering" },
    { id: 3, name: "Muhammad Shair", Degree: "BBA" },
  ];

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

  // Define your custom API route to get a user by ID
  server.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  });

  // Post Requests
  server.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);
    return res.status(201).json(newUser);
  });

  server.put("/api/users/:id", (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);
    const findUserIndex = users.findIndex((user) => user.id === parseId);
    if (findUserIndex === -1) return res.sendStatus(400);
    users[findUserIndex] = { id: parseId, ...body };
    return res.sendStatus(200);
  });

  // update the value
  server.patch("/api/users/:id", (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);
    const findUserIndex = users.findIndex((user) => user.id === parseId);
    if (findUserIndex === -1) return res.sendStatus(400);
    users[findUserIndex] = { ...users[findUserIndex], ...body };
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
