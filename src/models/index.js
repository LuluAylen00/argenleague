const fs = require('fs');
const path = require('path');

let filePath = path.resolve(__dirname, '../data/players.json')
let data = JSON.parse(fs.readFileSync(filePath, 'utf8')); 
let db = require("../database/models");
const e = require('express');

let fileMatchesPath = path.resolve(__dirname, '../data/matches.json')
// let matchesData = JSON.parse(fs.readFileSync(fileMatchesPath, 'utf8')); 

function save(d,path) {
    fs.writeFileSync(path, JSON.stringify(d,null,2));
    return;
}

const model = {
    findByTier: async (tier) => {
        // console.log(data);
        // let string = `INSERT INTO jugadores (nick, semilla, elo, categoriaId, grupoId) VALUES `
        // {
        //     let acc = data.map(p => {
        //         return `("${p.nick}",${p.prevData.seed},${p.prevData.elo},${Math.ceil(p.prevData.seed / 16)},${p.group})`
        //     })
        //     string += acc.toString() +";"
        // }
        // console.log(string);
        return db.Jugador.findAll({where: {categoriaId:tier}}).then((d)=>{
            // console.log(d);
            return d
        })
    },
    findByGroup: async (group,tier) => {
        // console.log(`Grupo: ${group} tiene ${model.findAllGroups(tier)[group].length}`);
        return model.findAllGroups(tier)[group]
    },
    findByPk: async (id) => {
        return db.Jugador.findByPk(id);
    },
    assignGroup: async (playerId, group) => {
        // function validGroup(g) {
        //     return g == 1 ? g == 1 : g == 2 ? g == 2 : g == 3 ? g == 3 : g == 4 ? g == 4 : false;
        // }
        let tier = await db.Jugador.findByPk(playerId).categoriaId
        if (group == null ? group == null : group == 1 ? group == 1 : group == 2 ? group == 2 : group == 3 ? group == 3 : group == 4 ? group == 4 : false) {
            // console.log(model.findByGroup(group,tier));
            if (await db.Grupo.findAll({where: {
                grupoId: group,
                categoriaId: tier
            }}).length == 4 && group != null) { // Grupo lleno
                return 500;
            // } else if(model.findByGroup(group,tier)) {

            } else {
                await db.Jugador.update({ where: {grupoId: group}})
                
                // model.createGroupMatches(tier, null);
                // save(data, filePath);
                return 200;
            }
        } else {
            return 400
        }
    },
    bringGroupMatches: async (params, tier)=> {
        let asd = await db.Partida.findAll(params).then((d) => d.filter((p,i) => (i+1) <= (tier * 20) && (i+1) > ((tier-1) * 20)))
        // console.log(asd);
        return asd
    },
    // saveGroupMatches: async (data)=> {
    //     // save(data, fileMatchesPath);
    // },
    setWinner: async (matchId, winner) => {
        // console.log("j",matchId);
        // let d = await model.bringGroupMatches();
        // let matchesAcc = []
        await db.Partida.update({ganador: winner},{where: {id: matchId}})
        let data = await db.Partida.findOne({where: {id: matchId}});
        let players = [data.jugadorUnoId, data.jugadorDosId]
        console.log(winner, winner != null);
        switch (matchId % 5) {
            case 1:
                await db.Partida.update({jugadorUnoId: winner != null ? players[winner] : null},{where: {id: matchId+2}});
                await db.Partida.update({jugadorUnoId: winner != null ? players.find((p,i) => i != winner) : null},{where: {id: matchId+3}});
                break;
            case 2:
                await db.Partida.update({jugadorDosId: winner != null ? players[winner] : null},{where: {id: matchId+1}});
                await db.Partida.update({jugadorDosId: winner != null ? players.find((p,i) => i != winner) : null},{where: {id: matchId+2}});
                break;
            case 3:
                await db.Partida.update({jugadorUnoId: winner != null ? players.find((p,i) => i != winner) : null},{where: {id: matchId+2}});
                break;
            case 4:
                await db.Partida.update({jugadorUnoId: winner != null ? players.find((p,i) => i != winner) : null},{where: {id: matchId+1}});
                break;
            default:
                break;
        }
        // d[tier].map(j => {
        //     // matchesAcc = [...matchesAcc, ...j[0], ...j[1], ...j[2], ...j[3], ...j[4]]
        //     for (let i = 0; i < j.length; i++) {
        //         const m = j[i];
        //         // console.log("m",j);
        //         if (m[0].id == matchId) {
        //             m[0].winner = winner
        //         }else if (m[1] && m[1].id == matchId){
        //             m[1].winner = winner
        //         }
        //     }
        //     return j;
        // });
        // // console.log(d[tier][0]);
        // console.log(matchesAcc);
        
        // await model.createGroupMatches();
        return;
    },
    setMatchInfo: async (matchId, tier, matchInfo) => {
        // console.log("j",matchId);
        let d = model.bringGroupMatches();
        // let matchesAcc = []
        d[tier].map(j => {
            // console.log("asd");
            // matchesAcc = [...matchesAcc, ...j[i]]
            for (let i = 0; i < j.length; i++) {
                const m = j[i];
                // console.log("m",j);
                if (m[0].id == matchId) {
                    m[0].matchInfo = matchInfo
                }else if (m[1] && m[1].id == matchId){
                    m[1].matchInfo = matchInfo
                }
            }
            return j;
        });
        // console.log(d[tier][0]);
        // console.log(matchesAcc);
        
        model.createGroupMatches(d,tier, matchId/* , matches */);
        return;
    },
    createGroupMatches: async () => {
        // console.log(matchId);
        let h = model.bringGroupMatches({include: [ "jugadorUno","jugadorDos","fecha" ]});
        let data = await db.Partida.findAll({include: [ "jugadorUno","jugadorDos","fecha" ]})
        // console.log(h);
        // let groupsToModify = matchesData
        // groupsToModify = [...groupsToModify["1"],...groupsToModify["2"],...groupsToModify["3"]]
        // let groupsToModify = Object.values(model.findAllGroups(tier)).filter((g,i) => {
        //     return Object.keys(model.findAllGroups(tier))[i] != "null"
        // });
        // console.log(groupsToModify);
        // let acc = []
        // let anotherAcc = [];
        // groupsToModify.forEach((group,i) => {
        //     // console.log(h[tier][i]);
        //     let matches = null;
        //     // if (matchId) {
        //     //     matches = [...h[tier][i][0],...h[tier][i][1],...h[tier][i][2]]
        //     // }
        //     let g = []

        //     tier = Math.ceil((i+1)/20)
        //     let baseId = (i*tier*5)
        //     // console.log(group);
        //     let fechaUno = [];
        //     fechaUno.push({
        //         id: baseId+1,
        //         playerOne: group[0] || "TBD",
        //         playerTwo: group[2] || "TBD",
        //         info: {
        //             schedule: "TBD",
        //             draft: "TBD"
        //         },
        //         winner: matches ? matches.find((r) => r.id == (baseId+1)).winner : null
        //     });
        //     fechaUno.push({
        //         id: baseId+2,
        //         playerOne: group[1] || "TBD",
        //         playerTwo: group[3] || "TBD",
        //         info: {
        //             schedule: "TBD",
        //             draft: "TBD"
        //         },
        //         winner: matches ? matches.find((r) => r.id == (baseId+2)).winner : null
        //     });
        //     g.push(fechaUno);

        //     let fechaDos = [];
        //     fechaDos.push({
        //         id: baseId+3,
        //         playerOne: fechaUno[0].winner == 0 && fechaUno[0].winner != null ? fechaUno[0].playerOne : fechaUno[0].winner != null ? fechaUno[0].playerTwo : undefined || "TBD",
        //         playerTwo: fechaUno[1].winner == 0 && fechaUno[1].winner != null ? fechaUno[1].playerOne : fechaUno[1].winner != null ? fechaUno[1].playerTwo : undefined || "TBD",
        //         info: {
        //             schedule: "TBD",
        //             draft: "TBD"
        //         },
        //         winner: (matchId == baseId + 1 || matchId == baseId + 2) ? null : matches ? matches.find((r) => r.id == (baseId+3)).winner : null
        //     })
        //     fechaDos.push({
        //         id: baseId+4,
        //         playerOne: fechaUno[0].winner == 0 && fechaUno[0].winner != null ? fechaUno[0].playerTwo : fechaUno[0].winner != null ? fechaUno[0].playerOne : undefined || "TBD",
        //         playerTwo: fechaUno[1].winner == 0 && fechaUno[1].winner != null ? fechaUno[1].playerTwo : fechaUno[1].winner != null ? fechaUno[1].playerOne : undefined || "TBD",
        //         info: {
        //             schedule: "TBD",
        //             draft: "TBD"
        //         },
        //         winner: (matchId == baseId + 1 || matchId == baseId + 2) ? null : matches ? matches.find((r) => r.id == (baseId+4)).winner : null
        //     })
        //     g.push(fechaDos)

        //     fechaTres = [];
        //     fechaTres.push({
        //         id: baseId+5,
        //         playerOne: (matchId == baseId + 1 || matchId == baseId + 2) ? "TBD" : fechaDos[0].winner == 0 && fechaUno[0].winner != null ? fechaDos[0].playerTwo : fechaUno[0].winner != null ? fechaDos[0].playerOne : undefined || "TBD",
        //         playerTwo: (matchId == baseId + 1 || matchId == baseId + 2) ? "TBD" : fechaDos[1].winner == 0 && fechaUno[1].winner != null ? fechaDos[1].playerOne : fechaUno[1].winner != null ? fechaDos[1].playerTwo : undefined || "TBD",
        //         info: {
        //             schedule: "TBD",
        //             draft: "TBD"
        //         },
        //         winner: (matchId == baseId + 1 || matchId == baseId + 2 || matchId == baseId + 3 || matchId == baseId + 4) ? null : matches ? matches.find((r) => r.id == (baseId+5)).winner : null
        //     })
        //     g.push(fechaTres)
        //     anotherAcc = [...anotherAcc, ...fechaUno, ...fechaDos, ...fechaTres]
        //     acc.push(g);
        // })
        // h[tier] = acc;
        // console.log("asd",anotherAcc);
        // let string = "INSERT INTO partidas (jugadorUnoId, jugadorDosId, fechaId, horario, draft, categoriaId) VALUES "
        // string += anotherAcc.map((p,i) => `(${p.playerOne ? p.playerOne.id || "null" : "null,${"+Math.ceil((i+1)/20)+"})"},${p.playerTwo ? p.playerTwo.id || "null" : "null,${"+Math.ceil((i+1)/20)+"})"},${p.id%5 == 0 ? 3 : p.id % 5 >= 3 ? 2 : 1 }, null, null,${Math.ceil((i+1)/20)})`).toString()
        // console.log(string);
        // model.saveGroupMatches(h);
        // return acc;
    },
    findAllGroups: async function(tier) {
        try {
            let data = await model.findByTier(tier);
            
            // console.log(data);
            let result = {
                '1': data.filter(r => r.grupoId == 1) || [],
                '2': data.filter(r => r.grupoId == 2) || [],
                '3': data.filter(r => r.grupoId == 3) || [],
                '4': data.filter(r => r.grupoId == 4) || [],
                'null': data.filter(r => r.grupoId == null) || [],
            }
            // console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    selectWinners: async (tier) => {
        let data2 = await db.Grupo.findAll({include: {association: "jugadores", where: {categoriaId: tier} ,include: ["partidasUno","partidasDos","categoria","grupo"]}})
        // let data = await db.Jugador.findAll({include: ["partidasUno","partidasDos","categoria","grupo"]})
        // console.log(data);
        // let acc1 = []
        data2 = data2.map((g,i) => {
            // g.jugadores.forEach(player => {
            //     player.partidas = [...player.partidasUno, ...player.partidasDos]
            // })
            let acc2 = [];
            g.jugadores.forEach((p,i) => {
                delete p.dataValues.partidasUno;
                delete p.dataValues.partidasDos;
                delete p.dataValues.categoriaId;
                delete p.dataValues.grupoId;
                // console.log(p);
                let newObj = {
                    id: p.id,
                    nick: p.nick,
                    elo: p.elo,
                    puntos: 0,
                    semilla: p.semilla,
                    categoria: p.categoria.dataValues,
                    grupo: p.grupo.dataValues,
                    // ...p.dataValues,
                    partidas: [...p.partidasUno, ...p.partidasDos]
                }
                let accP = newObj.partidas.reduce((acc, value)=> {
                    // console.log(`${p.nick} jugó contra ${p.id != value.jugadorDosId ? value.jugadorDosId : value.jugadorUnoId}, el ganador fue el jugador ${value.ganador}`);
                    if((value.ganador == 0 && value.jugadorUnoId == p.id) || (value.ganador == 1 && value.jugadorDosId == p.id)){
                        // console.log(`${p.nick} jugó contra ${p.id != value.jugadorDosId ? value.jugadorDosId : value.jugadorUnoId} y ganó`);
                        return acc + 2
                    } else if ((value.ganador == 1 && value.jugadorUnoId == p.id) || (value.ganador == 0 && value.jugadorDosId == p.id)) {
                        // console.log(`${p.nick} jugó contra ${p.id != value.jugadorDosId ? value.jugadorDosId : value.jugadorUnoId} y perdió`);
                        return acc - 1
                    }
                    return acc;
                },newObj.puntos)
                // console.log(accP);
                newObj.puntos = accP;
                acc2.push(newObj);
            })
            acc2.sort((a,b) => b.puntos - a.puntos);
            return acc2
        })
        let orden = {
            primeros: data2.map(g => {
                // console.log(g);
                if (g.find(p => p.puntos == 4)) {
                    return g.find(p => p.puntos == 4);
                } else {
                    // console.log(`${g[0].nick} tiene ${g[0].puntos} y está clasificado como primero`);
                    return null;
                }
            }),
            segundos: data2.map(g => {
                if (g.find(p => p.puntos == 3)) {
                    return g.find(p => p.puntos == 3);
                } else {
                    // console.log(`${g[1].nick} tiene ${g[1].puntos} y está clasificado como segundo`);
                    return null;
                }
            })
        }
        console.log(orden);
        return data2
    },
    updateNick: async function (id, nick){
        try {
            await db.Jugador.update({nick: nick},{where: {id: id}})
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

// model.setWinner(1,1,0);
// model.createGroupMatches(1)
// model.createGroupMatches(2)
// model.createGroupMatches(3)


module.exports = model;