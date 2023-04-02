const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path")

let port = process.env.PORT || 3418
app.listen(port, ()=> console.log("Servidor corriendo en el puerto "+port))

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/", require("./router/index"));

app.use((req,res,next) => {
    return res.redirect("/");
})
