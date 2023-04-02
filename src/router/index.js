const { Router } = require("express");
const app = Router();
const controller = require("../controllers/index")

app.get("/", controller.home);

app.get("/api/players/:tier", controller.apiList);

app.get("/api/groups/:tier", controller.apiGroups);

app.post("/api/groups", controller.apiSetGroup);

app.delete("/api/groups", controller.apiRemoveGroup);

app.use((req,res,next) => {
    return res.redirect("/");
})

module.exports = app;