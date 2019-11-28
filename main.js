const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';

let miner = require('action.' + MINER);
let upgrade = require('action.' + UPGRADE);
let builder = require('action.' + BUILDER);
let carry = require('action.' + CARRYER);

let summoner = require('spawer');

module.exports.loop = function () {
    Memory.Spw = Game.spawns['Spawn1'];
    //Memory.SW = Memory.Spw.room.find(FIND_SOURCES)[0];
    let spw = Memory.Spw;

    summoner.Check(Game);

    ///Main Select

    for (var c_name in Game.creeps) {
        var creep = Game.creeps[c_name];
        //creep.suicide();

        if (creep.memory.action == MINER) {
            miner.run(creep);
        }
        if (creep.memory.action == UPGRADE) {
            //creep.suicide();
            upgrade.run(creep);
        }
        if (creep.memory.action == BUILDER) {
            builder.run(creep);
        }
        if (creep.memory.action == CARRYER) {
            carry.run(creep);
        }
    }

///////// Visual
    if (spw.spawning) {
        spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
            spw.pos.x + 1, spw.pos.y,
            {align: 'left', opacity: 0.8});
    }
};

