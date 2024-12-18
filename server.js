// server.js
import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const users = [
    { id: 1, name: "Muhammad Zeeshan", Degree: "BSSE" },
    { id: 2, name: "Muhammad Tayyab Tahir", Degree: "Civil Engineering" },
    { id: 3, name: "Muhammad Shair", Degree: "BBA" },
  ];

  // Define your custom API route to get all users
  server.get("/api/users", (req, res) => {
    res.json(users);
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
