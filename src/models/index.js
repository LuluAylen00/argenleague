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
    findByGroup: (group) => {
        return model.findAllGroups()[group] ? model.findAllGroups()[group] : []
    },
    findByPk: (id) => {
        return data.find(d => d.id == id);
    },
    assignGroup: (playerId, group) => {
        // function validGroup(g) {
        //     return g == 1 ? g == 1 : g == 2 ? g == 2 : g == 3 ? g == 3 : g == 4 ? g == 4 : false;
        // }
        if (group == null ? group == null : group == 1 ? group == 1 : group == 2 ? group == 2 : group == 3 ? group == 3 : group == 4 ? group == 4 : false) {
            if (model.findByGroup(group).length == 4 && group != null) {
                return 500;
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
        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
        };
        let result = groupBy(model.findByTier(tier), 'group');
        result["1"] = result["1"] ? result["1"] : [];
        result["2"] = result["2"] ? result["2"] : [];
        result["3"] = result["3"] ? result["3"] : [];
        result["4"] = result["4"] ? result["4"] : [];
          
        return result;
    }
}

module.exports = model;