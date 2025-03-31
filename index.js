import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081/", // Cambia esto según tu frontend
    credentials: true, // Permite el envío de cookies de autenticación
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(PORT, () => {
  console.log("RabbitMQ Config:");
  console.log("Host:", process.env.RABBITMQ_HOST);
  console.log("User:", process.env.RABBITMQ_USER);
  console.log("Pass:", process.env.RABBITMQ_PASS);
  console.log("VHost:", process.env.RABBITMQ_USER);

  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
