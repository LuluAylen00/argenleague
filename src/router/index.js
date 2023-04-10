const { Router } = require("express");
const app = Router();
const controller = require("../controllers/index")

app.get("/", controller.home);

app.get("/api/players/:tier", controller.apiList);

app.get("/api/groups/:tier", controller.apiGroups);

app.post("/api/groups", controller.apiSetGroup);

app.delete("/api/groups", controller.apiRemoveGroup);

app.get("/api/group-phase/:tier", controller.apiShowGroups);

app.post("/api/group-phase/:tier", controller.apiSetWinner);

app.get("/api/group-phase-winners/:tier", controller.apiSendWinners);

app.put("/api/group-phase/:tier", controller.apiUpdateMatchInfo);

app.put("/api/players/update", controller.apiUpdateNick);

app.use((req,res,next) => {
    return res.redirect("/");
})

module.exports = app;