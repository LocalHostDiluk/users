import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
} from "../controllers/userController.js";

const router = express.Router(); // Router para crear rutas de nuestro servicio

router.get("/all", getUsers);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 * /app/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *      '200':
 *        description: A successful response
 */

router.post("/create", createUser);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 * /app/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     responses:
 *      '200':
 *        description: A successful response
 */

router.patch("/update/:id", updateUser);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 * /app/users/update/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     responses:
 *      '200':
 *        description: A successful response
 */

router.delete("/delete/:id", deleteUser);

router.post("/login", login);

router.post("/recover-password", recoverPassword);

router.post("/reset-password", resetPassword);

export default router;
