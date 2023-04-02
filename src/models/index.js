const fs = require('fs');
const path = require('path');

let filePath = path.resolve(__dirname, '../data/players.json')
let data = JSON.parse(fs.readFileSync(filePath, 'utf8')); 

function save(d) {
    fs.writeFileSync(filePath, JSON.stringify(d,null,2));
    return;
}

const model = {
    findAll: () => {
        return data
    },
    findByTier: (tier) => {
        return data.filter(p => Math.ceil(p.prevData.seed / 16) == tier);
    },
    findByGroup: (group,tier) => {
        // console.log(`Grupo: ${group} tiene ${model.findAllGroups(tier)[group].length}`);
        return model.findAllGroups(tier)[group]
    },
    findByPk: (id) => {
        return data.find(d => d.id == id);
    },
    assignGroup: (playerId, group) => {
        // function validGroup(g) {
        //     return g == 1 ? g == 1 : g == 2 ? g == 2 : g == 3 ? g == 3 : g == 4 ? g == 4 : false;
        // }
        let tier = Math.ceil(model.findByPk(playerId).prevData.seed / 16)
        if (group == null ? group == null : group == 1 ? group == 1 : group == 2 ? group == 2 : group == 3 ? group == 3 : group == 4 ? group == 4 : false) {
            // console.log(model.findByGroup(group,tier));
            if (model.findByGroup(group,tier).length == 4 && group != null) { // Grupo lleno
                return 500;
            // } else if(model.findByGroup(group,tier)) {

            } else {
                data = data.map(p => {
                    if (p.id == playerId) {
                        p.group = group;
                    }
                    return p;
                })
                save(data);
                return 200;
            }
        } else {
            return 400
        }
    },
    findAllGroups: function(tier) {
        let data = model.findByTier(tier);
        let result = {
            '1': data.filter(r => r.group == 1) || [],
            '2': data.filter(r => r.group == 2) || [],
            '3': data.filter(r => r.group == 3) || [],
            '4': data.filter(r => r.group == 4) || [],
            'null': data.filter(r => r.group == null) || [],
        }
        // console.log(result);
        return result;
    }
}

module.exports = model;