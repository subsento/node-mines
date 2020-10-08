'use strict';

const redis = require("redis");
var deasync = require('deasync');
const client = redis.createClient("redis://192.168.64.3:31578");
const hashmap = require('./logic/hashmap.js');
const factory = require('./logic/factory.js');

client.on("error", function(error) {
    console.error(error);
});

module.exports = {
    load,
    loadMin,
    save,
    getIds,
    remove
};

function toSpecialMap(mines) {
    let result = [];
    mines.forEach((mine) => {
        result[hashmap.getKey(mine)] = mine;
        result.push(mine);
    });
    return result;
}


function load(id) {
    let result = null;
    client.get(id.toString(), function (err, reply) {
        if (err) {
            throw err;
        }
        result = JSON.parse(reply.toString());
    });
    while(result === null)
    {
        deasync.runLoopOnce();
    }

    result.mines = toSpecialMap(result.mines);
    result.warnings = factory.calculateWarnings(result.mines, result.size);
    //result.covers = toSpecialMap(result.covers);
    return result;
}

function loadMin(id) {
    return strip(load(id));
}

function save(obj) {
    client.set(obj.id.toString(), JSON.stringify(obj));
    return obj;
}

function getIds() {
    return client.keys("*");
}

function remove(id) {
    var obj = load(id);
    client.del(obj.id.toString());
    return obj;
}

function strip(game) {
    if (!game) {
        return;
    }
    return {
        id: game.id,
        level: game.level,
        size: game.size,
        state: game.state
    };
}
