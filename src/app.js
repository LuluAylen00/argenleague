const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path")

app.listen(3418, ()=> console.log("Servidor corriendo en el puerto 3418"))

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/", require("./router/index"));

app.use((req,res,next) => {
    return res.redirect("/");
})
