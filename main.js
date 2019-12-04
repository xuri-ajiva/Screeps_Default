const act = 'action.';
const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACK = 'attack';

const RENEW = 'renew';

let repair = require(act + REPAIR);
let miner = require(act + MINER);
let upgrade = require(act + UPGRADE);
let builder = require(act + BUILDER);
let carry = require(act + CARRYER);
let attack = require(act + ATTACK);
let looter = require('special.' + LOOTER);
let spawnhelper = require(act + SPAWNHELPER);

let defend = require('defend');

let summoner = require('spawer');
let renewer = require('special.' + RENEW);

module.exports.loop = function () {
    Memory.stats = [];
    Memory.stats.push("0: " + Game.cpu.getUsed().toFixed(4));
    let c_this = Game.cpu.getUsed();

    //Memory.Spw = Game.spawns['Spawn1'];
    //Memory.SW = Memory.Spw.room.find(FIND_SOURCES)[0];
    let spw = Game.spawns['Spawn1'];

    Memory.stats.push("init: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();
    defend.run(spw.room);

    Memory.stats.push("defend: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();
    switch (Memory._count) {
        case 0:
            Memory.init = spw.room.controller.level;
            console.log("_private count: " + Memory._count++);
            //     break;
            // case 64:
            //     console.log("_private count: "+Memory._count++);
            //     break;
            // case 128:
            //     console.log("_private count: "+Memory._count++);
            //     break;
            // case 192:
            console.log("💬: private count: " + Memory._count++);
            break;
        case 255:
            Memory._count = 0;
            summoner.INIT(Game, spw);
            break;
        default:
            //Memory._count = 255;
            Memory._count++;
            break;
    }

    Memory.stats.push('_count: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    c_this = Game.cpu.getUsed();
    summoner.Check(Game, spw);

    Memory.stats.push('spawner: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    ///Main Select

    ///Memory.Spw.spawnCreep([MOVE], '_test', {memory: {action: 'architect'}})


    let co = {miner: 0, carry: 0, upgrade: 0, builder: 0, lootcolector: 0, repair: 0, spawnhelper: 0, attack: 0};

    for (var c_name in Game.creeps) {
        var creep = Game.creeps[c_name];
        //creep.suicide();


        if (creep) {
            c_this = Game.cpu.getUsed();
            /*if(creep.store[RESOURCE_ENERGY] == 0)
                creep.suicide();*/
            if (creep.memory.renew !== undefined) {
                renewer.reNewCreep(creep, spw);
                continue;
            }
            if (creep.ticksToLive < 100) {
                renewer.reNewCreep(creep, spw);
                //console.log('renew: ' + creep.name);
                continue;
            }
            switch (creep.memory.action) {
                case MINER:
                    // if (creep.ticksToLive < 50)
                    //     miner.recycle(creep, spw);
                    // else
                    miner.run(creep, spw);
                    break;
                case UPGRADE:
                    // if (creep.ticksToLive < 50)
                    //     upgrade.recycle(creep, spw);
                    // else
                    upgrade.run(creep, spw);
                    break;
                case BUILDER:
                    // if (creep.ticksToLive < 50)
                    //     builder.recycle(creep, spw);
                    // else
                    builder.run(creep, spw);
                    break;
                case CARRYER:
                    //creep.suicide();
                    // if (creep.ticksToLive < 50)
                    //     carry.recycle(creep, spw);
                    // else
                    carry.run(creep, spw);
                    break;
                case REPAIR:
                    // if (creep.ticksToLive < 200)
                    //     repair.recycle(creep, spw);
                    // else
                    repair.run(creep, spw);
                    break;
                case LOOTER:
                    // if (creep.ticksToLive < 200)
                    //     looter.recycle(creep, spw);
                    // else
                    looter.run(creep, spw);
                    break;
                case SPAWNHELPER:
                    spawnhelper.run(creep, spw);
                    break;
                case ATTACK:
                    //creep.suicide();
                    attack.run(creep, spw);
                    break;
                default:
                    break;
            }

            if (co[creep.memory.action] < (Game.cpu.getUsed() - c_this).toFixed(4)) {
                //console.log(creep.name);
                co[creep.memory.action] = (Game.cpu.getUsed() - c_this).toFixed(4);
            }
            Memory.stats.push(creep.memory.action + ': ' + (Game.cpu.getUsed() - c_this).toFixed(4));
        }
    }

    let log = '';
    for (let i in co) {
        log += i + ': ' + co[i] + "\n";
        Memory.stats.push(i + ': ' + co[i]);
    }
    //console.log(log+ Game.cpu.getUsed().toFixed(4));
    //if(Game.cpu.getUsed().toFixed(4) > 30){
    //    for (let x in Memory.stats){
    //        console.log(x + ': '+Memory.stats[x]+ "\n");
    //    }
    //}

    Memory.stats.push("end: " + Game.cpu.getUsed().toFixed(4));
};

