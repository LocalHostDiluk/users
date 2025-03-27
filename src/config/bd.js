import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Se puede activar para ver las consultas SQL
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conexión establecida con la base de datos"))
  .catch((error) =>
    console.error("Error al conectar con la base de datos:", error)
  );

export default sequelize;