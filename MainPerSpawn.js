const act = 'action.';
const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';
const CTF = 'ctf';

const RENEW = 'renew';

let repair = require(act + REPAIR);
let miner = require(act + MINER);
let upgrade = require(act + UPGRADE);
let builder = require(act + BUILDER);
let carry = require(act + CARRYER);
let attack = require(act + ATTACKE);
let looter = require('special.' + LOOTER);
let spawnhelper = require(act + SPAWNHELPER);

let defend = require('defend');

let summoner = require('spawer');
let renewer = require('special.' + RENEW);

let ctf = require('CaptureTheFlag');

require('prototype.spawn')();

module.exports = function (spawn) {

    //let s = require('action.' + SPAWNHELPER);
    //s.detectPos(undefined, Game.spawns['Spawn1']);
    //let t = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
    //for (const i in t) {
    //    t[i].remove();
    //}
    spawn.memory.stats = [];
    spawn.memory.stats.push("0: " + Game.cpu.getUsed().toFixed(4));
    let c_this = Game.cpu.getUsed();

    //Memory.spawn = Game.spawns['Spawn1'];
    //Memory.SW = Memory.spawn.room.find(FIND_SOURCES)[0];


    spawn.memory.stats.push("init: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();
    defend.run(spawn.room);

    spawn.memory.stats.push("defend: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();

    //spawn.memory._count = 255;
    switch (spawn.memory._count) {
        case 0:
            spawn.memory.init = spawn.room.controller.level;
            console.log("_private count: " + spawn.memory._count++);
            //     break;
            // case 64:
            //     console.log("_private count: "+Memory._count++);
            //     break;
            // case 128:
            //     console.log("_private count: "+Memory._count++);
            //     break;
            // case 192:
            console.log("💬: private count: " + spawn.memory._count++);
            break;
        case 255:
            spawn.memory._count = 0;
            summoner.Init(Game, spawn);
            break;
        default:
            //Memory._count = 255;
            spawn.memory._count++;
            break;
    }
    if(spawn.memory._count > 255){
        spawn.memory._count = 255;
    }

    //for (let x in Game.flags) {
    //    ctf.setPath(Game.flags[x], spawn);
    //}

    spawn.memory.stats.push('_count: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    c_this = Game.cpu.getUsed();
    summoner.Check(Game, spawn);

    spawn.memory.stats.push('spawner: ' + (Game.cpu.getUsed() - c_this).toFixed(4));
    //let s = require('action.' + SPAWNHELPER);
    //s.detectPos(undefined, spawn);
    //s.Build(undefined, spawn, true);
    ///Main Select

    ///Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,ATTACK,CARRY], '_test', {memory: {action: 'ctf'}})


    let co = {
        miner: [0, 0],
        carry: [0, 0],
        upgrade: [0, 0],
        builder: [0, 0],
        lootcolector: [0, 0],
        repair: [0, 0],
        spawnhelper: [0, 0],
        attack: [0, 0],
        ctf: [0, 0]
    };
    let s_this = Game.cpu.getUsed();
    let vs = undefined; // spawn.room.visual;
    let creeps = spawn.room.find(FIND_MY_CREEPS);
    for (var c_name in creeps) {
        var creep = creeps[c_name];
        //creep.suicide();

        if (creep) {
            c_this = Game.cpu.getUsed();
            /*if(creep.store[RESOURCE_ENERGY] == 0)
                creep.suicide();*/

            if (creep.memory.renew !== undefined) {
                //creep.suicide();
                renewer.reNewCreep(creep, spawn);
                if (vs) vs.text('🔋', creep.pos);
                continue;
            }
            if (creep.ticksToLive < 100) {
                if (vs) vs.text('🔋', creep.pos);
                renewer.reNewCreep(creep, spawn);
                //console.log('renew: ' + creep.name);
                continue;
            }
            switch (creep.memory.action) {
                case MINER:
                    miner.run(creep, spawn);
                    if (vs) vs.text('⛏', creep.pos);
                    break;
                case UPGRADE:
                    upgrade.run(creep, spawn);
                    if (vs) vs.text('🔧', creep.pos);
                    break;
                case BUILDER:
                    builder.run(creep, spawn);
                    if (vs) vs.text('⛑', creep.pos);
                    break;
                case CARRYER:
                    carry.run(creep, spawn);
                    if (vs) vs.text('🧰', creep.pos);
                    break;
                case REPAIR:
                    repair.run(creep, spawn);
                    if (vs) vs.text('🩹', creep.pos);
                    break;
                case LOOTER:
                    looter.run(creep, spawn);
                    if (vs) vs.text('🎁', creep.pos);
                    break;
                case SPAWNHELPER:
                    spawnhelper.run(creep, spawn);
                    if (vs) vs.text('🧬', creep.pos);
                    break;
                case ATTACKE:
                    //creep.suicide();
                    attack.run(creep, spawn);
                    if (vs) vs.text('🧨', creep.pos);
                    break;
                case CTF:
                    ctf.move(creep);
                    break;
                default:
                    break;
            }
            co[creep.memory.action][1]++;
            if (co[creep.memory.action][0] < (Game.cpu.getUsed() - c_this).toFixed(4)) {
                //console.log(creep.name);
                co[creep.memory.action][0] = (Game.cpu.getUsed() - c_this).toFixed(4);
            }
            //Memory.stats.push(creep.memory.action + ': ' + (Game.cpu.getUsed() - c_this).toFixed(2));
        }
    }
    spawn.memory.stats.push('creeps: ' + (Game.cpu.getUsed() - s_this).toFixed(4));

    let log = '';
    for (let i in co) {
        log += '|' + co[i][1] + '| ' + ((2 - ('' + co[i][1]).length) === 1 ? ' ' : '') + i + ': ' + co[i][0] + "\n";
        //Memory.stats.push(i + ': ' + co[i]);
    }
    //console.log(log + Game.cpu.getUsed().toFixed(4));
    //if(Game.cpu.getUsed().toFixed(4) > 30){
    //    for (let x in Memory.stats){
    //        console.log(x + ': '+Memory.stats[x]+ "\n");
    //    }
    //}

    spawn.memory.stats.push("end: " + Game.cpu.getUsed().toFixed(4));
};