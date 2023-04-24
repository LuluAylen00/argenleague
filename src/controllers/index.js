const model = require('../models/index');
const fs = require("fs");
const path = require("path");
const db = require("../database/models")

const controller = {
    home: (req,res) => {
        return res.sendFile(path.resolve(__dirname, "../views/index.html"));
    },
    apiList: async (req,res) => {
        return res.send( await model.findByTier(req.params.tier));
    },
    apiGroups: async (req,res) => {
        return res.send( await model.findAllGroups(req.params.tier));
    },
    apiSetGroup: async (req,res) => {
        // console.log(req.body);
        let result = await model.assignGroup(req.body.id, req.body.group)
        return res.send({
            status: result
        });
    },
    apiRemoveGroup: async (req,res) => {
        // console.log(req.body);
        await model.assignGroup(req.body.id, null);
        return res.send({
            status: 200
        });
    },
    apiShowGroups: async function(req, res) {
        let result = await model.bringGroupMatches({include: [ "jugadorUno","jugadorDos","fecha" ]},req.params.tier);
        // console.log(result);
        res.status(200).send(result)
    },
    apiInitGroups: async function(req, res) {
        res.send(await model.createGroupMatches(req.params.tier))
    },
    apiSetWinner: async function(req, res) {
        console.log("Llegó una petición");
        await model.setWinner(req.body.match, req.body.winner);
        return res.send({
            status: 200
        })
    },
    apiUpdateMatchInfo: async function(req, res) {
        await model.setMatchInfo(req.body.match, req.params.tier, {schedule: req.body.schedule, draft: req.body.draft});
        return res.send({
            status: 200
        })
    },
    apiSendWinners: async function (req, res) {
        res.send(await model.selectWinners(req.params.tier));
    },
    apiUpdateNick: async function (req, res) {
        res.send(await model.updateNick(req.body.id,req.body.nick));
    },
    displayFinalPhase: async function (req, res) {
        let info = await db.Final.findAll({where: {categoriaId: req.params.tier}})
        res.send(info)
    },
    setFinalMatchPlayer: async function (req, res) {
        let playerType = req.body.playerType;
        let info
        info = await db.Final.update({
            jugadorUnoId: null
        },{where: {jugadorUnoId: req.body.playerId}})
        info += await db.Final.update({
            jugadorDosId: null
        },{where: {jugadorDosId: req.body.playerId}})

        if (req.body.matchId != null) {
            info = await db.Final.update({
                [playerType]: req.body.playerId
            },{where: {id: req.body.matchId}})
        }

        // if (info[0] > 0) {
            return res.send({
                status: 200
            })
        // } /* else {
            // return res.send({
            //     status: 403
            // })
        // } */
    }
}

module.exports = controller;