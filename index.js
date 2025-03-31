import app from "./src/app.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log("RabbitMQ Config:");
  console.log("Host:", process.env.RABBITMQ_HOST);
  console.log("User:", process.env.RABBITMQ_USER);
  console.log("Pass:", process.env.RABBITMQ_PASS);
  console.log("VHost:", process.env.RABBITMQ_USER);

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
