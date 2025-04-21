import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //genSalt() returns a Promise, which is why you must use await.

    const collection = db.collection("users");

    await collection.insertOne(user);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })
})

authRouter.post("/login", async (req, res) => {

    const user = await db.collection("users").findOne({
        username: req.body.username,
    })

    if(!user) {
        return res.status(404).json({
            message: "User not found",
        })
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    console.log("Entered password:", req.body.password);
    console.log("Stored hash:", user.password);

    if(!isValidPassword) {
        return res.status(401).json({
            message: "Invalid password",
        })
    }

    return res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })
})

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้

export default authRouter;
