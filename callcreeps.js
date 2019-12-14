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
let ctf = require(act + CTF);
let renewer = require('special.' + RENEW);

module.exports = {


    call: function () {
        let co = {
            miner: [0, 0],
            carry: [0, 0],
            upgrade: [0, 0],
            builder: [0, 0],
            lootcolector: [0, 0],
            repair: [0, 0],
            spawnhelper: [0, 0],
            attack: [0, 0],
            ctf: [0, 0],
            undefined: [0, 0]
        };
        let vs = false;// /*undefined; */spawn.room.visual;
        let creeps = Game.creeps;//spawn.room.find(FIND_MY_CREEPS);
        for (let c_name in creeps) {
            let creep = creeps[c_name];
            //console.log(creep.name + ': '+ Game.cpu.getUsed());
            let spawn = undefined;
            if (creep.memory.spawn)
                spawn = Game.getObjectById(creep.memory.spawn);
            else {
                spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                creep.memory.spawn = spawn.id;
            }

            let vs = creep.room.visual;
            if (creep) {
                //console.log(creep.name+ ': '+ creep.pos)
                let c_this = Game.cpu.getUsed();
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
                        if(spawn.memory.energy_sources){
                            spawn.memory.energy_sources[creep.memory.source]++;
                        }
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
                //console.log(creep.name + ': '+ (Game.cpu.getUsed() - c_this));
                co[creep.memory.action][1]++;
                if (co[creep.memory.action][0] < (Game.cpu.getUsed() - c_this).toFixed(4)) {
                    //console.log(creep.name);
                    co[creep.memory.action][0] = (Game.cpu.getUsed() - c_this).toFixed(4);
                }
                //Memory.stats.push(creep.memory.action + ': ' + (Game.cpu.getUsed() - c_this).toFixed(2));
            }
        }

        let log = '';
        for (let i in co) {
            log += '|' + co[i][1] + '| ' + ((2 - ('' + co[i][1]).length) === 1 ? ' ' : '') + i + ': ' + co[i][0] + "\n";
            //Memory.stats.push(i + ': ' + co[i]);
        }
        //console.log(log + Game.cpu.getUsed().toFixed(4));

    },
};