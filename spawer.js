const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const CARRYERS = 18;
const MINERS = 7;
const BUILDERS = 4;
const UPGRADERS = 4;
const REPAIRS = 4;

var spawnner = {
    Check: function (game, spw, sw) {
        if (sw) {
            // Memory.VIP = [];
            // let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            // towers.forEach(tower => Memory.VIP.push(tower.id));
            let architect = require(ARCHITECT);
            architect.run(Memory.init, spw);
            if (Memory.need_energy === undefined)
                Memory.need_energy = [];
            if (Memory.query === undefined)
                Memory.query = [];

            Memory.creeps_count_by_action = {miner: 0, carry: 0, upgrade: 0, builder: 0, lootcolector: 0, repair: 0};
            for (let it in Game.creeps) {
                let creep = Game.creeps[it];
                Memory.creeps_count_by_action[creep.memory.action] += 1;
            }


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
                    console.log('removing duplicate: ' + ca.memory.pet)
                    delete ca.memory.pet;
                } else {
                    pets.push(ca.memory.pet);
                }
            }

            switch (Memory.init) {
                case -1:
                    break;
                case 0:

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
        }

        if (Memory.query.length > 0) {
            var c = Game.creeps[Memory.query.pop()];
            if (c) {
                Memory.need_energy.push(c.id);
            }
        }
        for (let name in Memory.creeps)
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('✝: ' + name);
            }


        let spawn = function (obj, ls, adj) {
            var newName = obj + Game.time;
            if (adj) {
                let memory = Object.assign({}, {action: obj}, adj);
                console.log('*: ' + newName + ' =>' + spw.spawnCreep(ls, newName, {
                    memory
                }));
            } else {
                console.log('*: ' + newName + ' =>' + spw.spawnCreep(ls, newName, {memory: {action: obj}}));
            }
            return newName;
        };

        function SpawnMiner(energy) {
            if (energy < 250) return;
            spawn(MINER, [WORK, MOVE, WORK], {
                source: spw.room.find(FIND_SOURCES)[parseInt(Math.random() * 1)].id,
                count: 0
            });
            Memory.creeps_count_by_action[MINER] += 1;
        }

        function SpawnRepair(energy) {
            if (energy < 400) return;
            let name = spawn(REPAIR, [MOVE, CARRY, CARRY, CARRY, WORK, WORK],);

            console.log("🔜: " + name);
            Memory.query.push(name);

            Memory.creeps_count_by_action[REPAIR] += 1;
        }

        function SpawnBuilder(energy) {
            let name = spawn(BUILDER, [MOVE, CARRY, WORK, WORK]);

            console.log("🔜: " + name);
            Memory.query.push(name);

            Memory.creeps_count_by_action[BUILDER] += 1;
        }

        function SpawnUpgrader(energy) {
            let name = spawn(UPGRADE, [MOVE, CARRY, WORK]);

            console.log("🔜: " + name);
            Memory.query.push(name);

            Memory.creeps_count_by_action[UPGRADE] += 1;
        }

        function SpawnCarry(length, available) {
            let parts = [MOVE, MOVE, CARRY, CARRY];
            if (available >= 300) {
                if (length > 3) {
                    parts.push(MOVE)
                }
                if (length > 9) {
                    parts.push(CARRY)
                }
            } else if (available >= 400) {
                parts.push(MOVE);
                parts.push(MOVE);
                parts.push(CARRY);
                parts.push(CARRY);
            }
            if (Memory.need_energy === undefined)
                Memory.need_energy = [];
            spawn(CARRYER, parts, Memory.need_energy.length > 0 ? {pet: Memory.need_energy.shift()} : undefined);


            Memory.creeps_count_by_action[CARRYER] += 1;
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

            let c_UPGRADE = Memory.creeps_count_by_action[UPGRADE];
            let c_MINER = Memory.creeps_count_by_action[MINER];
            let c_CARRYER =  Memory.creeps_count_by_action[CARRYER];
            let c_REPAIR = Memory.creeps_count_by_action[REPAIR];
            let c_LOOTER = Memory.creeps_count_by_action[LOOTER];
            let c_BUILDER = Memory.creeps_count_by_action[BUILDER];
            if (c_MINER < MINERS && c_MINER < c_CARRYER) {
                SpawnMiner(energy);
                return;
            }
            if (energy < 200) return;
            if (c_UPGRADE < UPGRADERS && c_UPGRADE < c_CARRYER - 1) {
                SpawnUpgrader(energy);
                return;
            }
            if (c_CARRYER < CARRYERS) {
                SpawnCarry(c_CARRYER, energy);
                return;
            }
            if (c_REPAIR < REPAIRS && c_REPAIR < c_CARRYER) {
                SpawnRepair(energy);
            }
            if (c_LOOTER < 1 && c_LOOTER < c_CARRYER && (spw.room.find(FIND_RUINS, {
                filter: (structure) => {
                    return structure.store[RESOURCE_ENERGY] > 0;
                }
            }).length > 0 || spw.room.find(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return structure.ticksToDecay > 30;
                }
            }).length > 0)) {
                spawn(LOOTER, [MOVE, CARRY, WORK]);
                return;
            }


            if (energy < 300) return;
            if (spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && c_BUILDER < BUILDERS) {
                SpawnBuilder(energy);
                return;
            }
        } else {
            spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
                spw.pos.x + 1, spw.pos.y,
                {align: 'left', opacity: 0.7});
        }
    }
};
module.exports = spawnner;