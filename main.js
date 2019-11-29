const act = 'action.';
const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';

let repair = require(act + REPAIR);
let miner = require(act + MINER);
let upgrade = require(act + UPGRADE);
let builder = require(act + BUILDER);
let carry = require(act + CARRYER);
let architect = require(act + ARCHITECT);

let summoner = require('spawer');

module.exports.loop = function () {
    //Memory.Spw = Game.spawns['Spawn1'];
    //Memory.SW = Memory.Spw.room.find(FIND_SOURCES)[0];
    let spw = Game.spawns['Spawn1'];

    switch (Memory._count) {
        case 0:
            Memory.init = spw.room.controller.level;
        //     console.log("_private count: "+Memory._count++);
        //     break;
        // case 64:
        //     console.log("_private count: "+Memory._count++);
        //     break;
        // case 128:
        //     console.log("_private count: "+Memory._count++);
        //     break;
        // case 192:
            console.log("💬: private count: "+Memory._count++);
            break;
        case 255:
            let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
            let pets = [];
            for(let c in carryers){
                let ca = carryers[c];
                if(pets.includes(ca.memory.pet)){
                    console.log('removing duplicate: ' +ca.memory.pet)
                    delete ca.memory.pet;
                }
                else{
                    pets.push(ca.memory.pet);
                }
            }
            Memory._count = 0;

            summoner.Check(Game, spw,true);
            break;
        default:
            Memory._count++;
            break;
    }

    summoner.Check(Game, spw);

    ///Main Select

    ///Memory.Spw.spawnCreep([MOVE], '_test', {memory: {action: 'architect'}})

    for (var c_name in Game.creeps) {
        var creep = Game.creeps[c_name];
        //creep.suicide();

        if (creep) {
            if (creep.memory.action == MINER) {
                //creep.suicide();
                miner.run(creep, spw);
            }
            if (creep.memory.action == UPGRADE) {
                //creep.suicide();
                upgrade.run(creep, spw);
            }
            if (creep.memory.action == BUILDER) {
                //creep.suicide();
                builder.run(creep, spw);
            }
            if (creep.memory.action == CARRYER) {
                //creep.suicide();
                carry.run(creep, spw);
            }
            if (creep.memory.action == ARCHITECT) {
                //creep.suicide();
                architect.run(creep, spw);
            }
            if (creep.memory.action == REPAIR) {
                //creep.suicide();
                repair.run(creep, spw);
            }
        }
    }


};

