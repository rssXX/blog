import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(444, (err) => {
    if (err){
        return console.error(err)
    }

    console.log("Server Ok")
})