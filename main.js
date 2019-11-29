const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';

let miner = require('action.' + MINER);
let upgrade = require('action.' + UPGRADE);
let builder = require('action.' + BUILDER);
let carry = require('action.' + CARRYER);
let architect = require('action.' + ARCHITECT);

let summoner = require('spawer');

module.exports.loop = function () {
    //Memory.Spw = Game.spawns['Spawn1'];
    //Memory.SW = Memory.Spw.room.find(FIND_SOURCES)[0];
    let spw = Game.spawns['Spawn1'];

    summoner.Check(Game, spw);

    ///Main Select

    ///Memory.Spw.spawnCreep([MOVE], '_test', {memory: {action: 'architect'}})

    for (var c_name in Game.creeps) {
        var creep = Game.creeps[c_name];
        //creep.suicide();

        if (creep) {
            if (creep.memory.action == MINER) {
                //creep.suicide();
                miner.run(creep,spw);
            }
            if (creep.memory.action == UPGRADE) {
                //creep.suicide();
                upgrade.run(creep,spw);
            }
            if (creep.memory.action == BUILDER) {
                //creep.suicide();
                builder.run(creep,spw);
            }
            if (creep.memory.action == CARRYER) {
                //creep.suicide();
                carry.run(creep,spw);
            }
            if (creep.memory.action == ARCHITECT) {
                //creep.suicide();
                architect.run(creep,spw);
            }
        }
    }

///////// Visual
    if (spw.spawning) {
        spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
            spw.pos.x + 1, spw.pos.y,
            {align: 'left', opacity: 0.8});
    }
};

