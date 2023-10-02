import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

mongoose
    .connect(
        "mongodb+srv://admin:X219898x@cluster0.mzrgont.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("DB OK");
    })
    .catch((err) => {
        console.error("DB Error", err);
    });

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/auth/login", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "не удалось зарегистрироваться",
        });
    }
});

app.listen(444, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log("Server Ok");
});
