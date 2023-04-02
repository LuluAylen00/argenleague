const model = require('../models/index');
const fs = require("fs");
const path = require("path");

const controller = {
    home: (req,res) => {
        return res.sendFile(path.resolve(__dirname, "../views/index.html"));
    },
    apiList: (req,res) => {
        return res.send(model.findByTier(req.params.tier));
    },
    apiGroups: (req,res) => {
        return res.send(model.findAllGroups(req.params.tier));
    },
    apiSetGroup: (req,res) => {
        // console.log(req.body);
        let result = model.assignGroup(req.body.id, req.body.group)
        return res.send({
            status: result
        });
    },
    apiRemoveGroup: (req,res) => {
        // console.log(req.body);
        model.assignGroup(req.body.id, null);
        return res.send({
            status: 200
        });
    }
}

module.exports = controller;