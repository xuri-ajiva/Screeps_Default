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
const CLAIMER = 'claim';
const RENEW = 'renew';

let repair = require(act + REPAIR);
let miner = require(act + MINER);
let upgrade = require(act + UPGRADE);
let builder = require(act + BUILDER);
let carry = require(act + CARRYER);
let attack = require(act + ATTACKE);
let looter = require('special.' + LOOTER);
let spawnhelper = require(act + SPAWNHELPER);
let ctf = require('CaptureTheFlag');
let renewer = require('special.' + RENEW);

module.exports = {

    call: function () {
        let vs = false;// /*undefined; */spawn.room.visual;
        let creeps = Game.creeps;//spawn.room.find(FIND_MY_CREEPS);
        for (let c_name in creeps) {
            let creep = creeps[c_name];
            let spawn = undefined;
            if (creep.memory.spawn)
                spawn = Game.getObjectById(creep.memory.spawn);
            else {
                spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                creep.memory.spawn = spawn.id;
            }

            let vs = creep.room.visual;
            if (creep) {
                //c_this = Game.cpu.getUsed();
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
                        if (vs) vs.text('📘', creep.pos);
                        break;
                    case CARRYER:
                        carry.run(creep, spawn);
                        //if (vs) vs.text('🧰', creep.pos);
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
                        attack.run(creep, spawn);
                        if (vs) vs.text('🧨', creep.pos);
                        break;
                    case CTF:
                        ctf.move(creep);
                        if (vs) vs.text('⛳', creep.pos);
                        break;
                    default:
                        break;
                }
                //co[creep.memory.action][1]++;
                //if (co[creep.memory.action][0] < (Game.cpu.getUsed() - c_this).toFixed(4)) {
                //    //console.log(creep.name);
                //    co[creep.memory.action][0] = (Game.cpu.getUsed() - c_this).toFixed(4);
                //}
                //Memory.stats.push(creep.memory.action + ': ' + (Game.cpu.getUsed() - c_this).toFixed(2));
            }
        }
    },


};