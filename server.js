import express from "express";
import next from "next";
import winston from "winston";
import validationSchema from "./lib/validation.js";
import router from "./server/routes/userRoutes.js";
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
  server.use(router);

  server.post(
    "/",

    (req, res) => {
      // Check for validation errors
      const { error, value } = validationSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          errors: error.details.map((err) => ({
            message: err.message,
            path: err.path,
          })),
        });
      }

      // If no validation errors, send the request body as a response
      res.json({ data: req.body });
    }
  );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
