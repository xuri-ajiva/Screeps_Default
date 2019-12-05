const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';
const CARRYERS = 17; //(+1)
const MINERS = 7;
const BUILDERS = 4;
const UPGRADERS = 4;
const REPAIRS = 4;
const SPAENHELPERS = 2;

let spawner = {
    Init: function (Game, spw) {
        // Memory.VIP = [];
        // let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // towers.forEach(tower => Memory.VIP.push(tower.id));
        let architect = require(ARCHITECT);
        architect.run(Memory.init, spw);
        if (Memory.need_energy === undefined)
            Memory.need_energy = [];
        if (Memory.query === undefined)
            Memory.query = [];

        Memory.creeps_count_by_action = {
            miner: 0,
            carry: 0,
            upgrade: 0,
            builder: 0,
            lootcolector: 0,
            repair: 0,
            spawnhelper: 0,
            attack: 0
        };
        for (let it in Game.creeps) {
            let creep = Game.creeps[it];
            Memory.creeps_count_by_action[creep.memory.action] += 1;
        }
        console.log(Memory.creeps_count_by_action[SPAWNHELPER]);


        // let towers = spw.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // towers.forEach((tower) => {
        //     if (!Memory.pets.includes(tower.id))
        //         Memory.need_energy.push(tower.id);
        // });

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        let pets = [];
        for (let c in carryers) {
            let ca = carryers[c];
            if (pets.includes(ca.memory.pet)) {
                console.log('removing duplicate: ' + ca.memory.pet);
                delete ca.memory.pet;
            } else {
                pets.push(ca.memory.pet);
            }
        }

        if (Memory._extentions && Memory._extentions[0] === 4) {
            //let cpu = Game.cpu.getUsed();
            let s = require('action.' + SPAWNHELPER);
            s.Build(undefined, spw, true, ++Memory._extentions[2], Memory._extentions[2]);
            if (Memory._extentions[2] > 16) {
                Memory._extentions[2] = -1;
            }
            //console.log(Game.cpu.getUsed() - cpu + ' '+Memory._extentions[2]);
        }

        switch (Memory.init) {
            case -1:
                break;
            case 0:
                let s = require('action.' + SPAWNHELPER);
                s.detectPos(undefined, spw);
                console.log('INIT: ' + Memory.init);
                break;
            case 1:
                console.log('INIT: ' + Memory.init);
                break;
            case 2:
                console.log('INIT: ' + Memory.init);
                break;
            case 3:

                console.log('INIT: ' + Memory.init);
                break;
            case 4:
                console.log('INIT: ' + Memory.init);
                break;
            case 5:
                console.log('INIT: ' + Memory.init);
                break;
            case 6:
                console.log('INIT: ' + Memory.init);
                break;
            case 7:
                console.log('INIT: ' + Memory.init);
                break;
            default:
                Memory.init = 0;
        }
        return;
    },

    Check: function (game, spw) {
        if (Memory.query && Memory.query.length > 0) {
            var c = Game.creeps[Memory.query.pop()];
            if (c) {
                Memory.need_energy.push(c.id);
            }
        }
        for (let name in Memory.creeps)
            if (!Game.creeps[name]) {
                if (name.includes('attack'))
                    Memory.creeps_count_by_action[ATTACKE] -= 1;
                delete Memory.creeps[name];
                console.log('✝: ' + name);
            }

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        Memory.pets = _.map(carryers, function (s) {
            return s.memory.pet;
        });

        if (!spw.spawning) {
            let energy = spw.room.energyAvailable;
            //console.log(energy);
            //if (energy < 250) return;
            if (energy < 150) return;
            spw.room.visual.text('⚡' + energy + '⚡',
                spw.pos.x - .7, spw.pos.y,
                {align: 'left', opacity: 1, color: '#ff00f5', font: .3});

            let c_UPGRADE = Memory.creeps_count_by_action[UPGRADE];
            let c_MINER = Memory.creeps_count_by_action[MINER];
            let c_CARRYER = Memory.creeps_count_by_action[CARRYER] - 1;
            let c_REPAIR = Memory.creeps_count_by_action[REPAIR];
            let c_LOOTER = Memory.creeps_count_by_action[LOOTER];
            let c_BUILDER = Memory.creeps_count_by_action[BUILDER];
            let c_SPAENHELPER = Memory.creeps_count_by_action[SPAWNHELPER];
            let c_ATTACKER = Memory.creeps_count_by_action[ATTACKE];

            if (c_MINER < MINERS && c_MINER < c_CARRYER) {
                let name = spw.SpawnCustomCreep(energy, MINER);
                Memory.creeps_count_by_action[MINER] += 1;
            } else if (c_UPGRADE < UPGRADERS && c_UPGRADE < c_CARRYER - 1) {
                let name = spw.SpawnCustomCreep(energy, UPGRADE);
                console.log("🔜: " + name);
                Memory.query.push(name);
                Memory.creeps_count_by_action[UPGRADE] += 1;
            } else if (c_SPAENHELPER < SPAENHELPERS && c_SPAENHELPER < c_CARRYER - 1) {
                let name = spw.SpawnCustomCreep(energy, SPAWNHELPER);
                Memory.creeps_count_by_action[SPAWNHELPER] += 1;
            } else if (c_CARRYER < CARRYERS) {
                spw.SpawnCustomCreep(energy, CARRYER, Memory.need_energy.length > 0 ? {pet: Memory.need_energy.shift()} : undefined);
                Memory.creeps_count_by_action[CARRYER] += 1;
            } else if (c_ATTACKER < 4 && c_ATTACKER < c_CARRYER) {
                spw.SpawnCustomCreep(energy, ATTACKE);
                Memory.creeps_count_by_action[ATTACKE] += 1;
            } else if (c_LOOTER < 1 && c_LOOTER < c_CARRYER && (spw.room.find(FIND_RUINS, {
                filter: (structure) => {
                    return structure.store[RESOURCE_ENERGY] > 0;
                }
            }).length > 0 || spw.room.find(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return structure.ticksToDecay > 30;
                }
            }).length > 0)) {
                spw.SpawnCustomCreep(energy, LOOTER);
                Memory.creeps_count_by_action[LOOTER] += 1;
            } else if (spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && c_BUILDER < BUILDERS) {
                let name = spw.SpawnCustomCreep(energy, BUILDER);
                console.log("🔜: " + name);
                Memory.query.push(name);
                Memory.creeps_count_by_action[BUILDER] += 1;
            } else if (c_REPAIR < REPAIRS && c_REPAIR < c_CARRYER) {
                let name = spw.SpawnCustomCreep(energy, REPAIR);
                console.log("🔜: " + name);
                Memory.query.push(name);
                Memory.creeps_count_by_action[REPAIR] += 1;
            }

        } else {
            spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
                spw.pos.x + 1, spw.pos.y,
                {align: 'left', opacity: 0.7});
        }
    }
};
module.exports = spawner;