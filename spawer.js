const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const CARRYERS = 16;
const MINERS = 9;
const BUILDERS = 4;
const UPGRADERS = 4;
const REPAIRS = 4;

var spawnner = {
    Check: function (game, spw, sw) {

        if (sw) {
            let architect = require(ARCHITECT);
            architect.run(Memory.init, spw);
            switch (Memory.init) {
                case -1:
                    break;
                case 0:
                    if (Memory.need_energy === undefined)
                        Memory.need_energy = [];
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
        }

        function SpawnRepair(energy) {
            if (energy < 400) return;
            let name = spawn(REPAIR, [MOVE, CARRY, CARRY, CARRY, WORK, WORK],);

            console.log("🔜: " + name);
            Memory.need_energy.push(name);

        }

        function SpawnBuilder(energy) {
            let name = spawn(BUILDER, [MOVE, CARRY, WORK, WORK]);

            console.log("🔜: " + name);
            Memory.need_energy.push(name);

        }

        function SpawnUpgrader(energy) {
            let name = spawn(UPGRADE, [MOVE, CARRY, WORK]);

            console.log("🔜: " + name);
            Memory.need_energy.push(name);

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
        }

        //let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        //Memory.pets = _.map(carryers, function (s) {
        //    return s.memory.pet.substr(7);
        //});

        if (!spw.spawning) {
            let energy = 0;
            _.forEach(spw.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                        return structure.store[RESOURCE_ENERGY];
                }
            }), (s) => energy += s.store[RESOURCE_ENERGY]);
            //console.log(energy);
            //if (energy < 250) return;
            if (energy < 150) return;
            let miners = _.filter(Game.creeps, (creep) => creep.memory.action == MINER);
            let carryers = _.filter(Game.creeps, (creep) => creep.memory.action == CARRYER);

            if (miners.length < MINERS && miners.length < carryers.length) {
                SpawnMiner(energy);
                return;
            }
            if (energy < 200) return;
            let upgraderes = _.filter(Game.creeps, (creep) => creep.memory.action == UPGRADE);
            if (upgraderes.length < UPGRADERS && upgraderes.length < carryers.length - 1) {
                SpawnUpgrader(energy);
                return;
            }
            if (carryers.length < CARRYERS) {
                SpawnCarry(carryers.length, energy);
                return;
            }
            let repairs = _.filter(Game.creeps, (creep) => creep.memory.action == REPAIR);
            if (repairs.length < REPAIRS && repairs.length < carryers.length) {
                SpawnRepair(energy);
            }

            let looters = _.filter(Game.creeps, (creep) => creep.memory.action == LOOTER);
            if (looters.length < 1 && looters.length < carryers.length && spw.room.find(FIND_RUINS, {
                filter: (structure) => {
                    return structure.store[RESOURCE_ENERGY] > 0;
                }
            }).length > 0) {
                spawn(LOOTER, [MOVE, CARRY, WORK]);
            }


            if (energy < 300) return;
            let builders = _.filter(Game.creeps, (creep) => creep.memory.action == BUILDER);
            if (spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && builders.length < BUILDERS) {
                SpawnBuilder(energy);
                return;
            }
        } else {
            spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
                spw.pos.x + 1, spw.pos.y,
                {align: 'left', opacity: 0.7});
        }

        for (let name in Memory.creeps)
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('✝: ' + name);
            }
    }
};
module.exports = spawnner;