const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const CARRYERS = 12;
const MINERS = 9;
const BUILDERS = 4;
const UPGRADERS = 4;


var spawnner = {
    Check: function (game,Spw) {
        let spawn = function (obj, ls, adj) {
            var newName = obj + Game.time;
            if (adj) {
                let memory = Object.assign({}, {action: obj}, adj);
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Spw.spawnCreep(ls, newName, {
                    memory
                }));
            } else {
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Spw.spawnCreep(ls, newName, {memory: {action: obj}}));
            }
            return newName;
        };

        function SpawnMiner() {
            let name = spawn(MINER, [WORK, MOVE, WORK], {
                source: Spw.room.find(FIND_SOURCES)[parseInt(Math.random() * 1)].id,
                count: 0
            });
        }

        function SpawnBuilder() {
            let name = spawn(BUILDER, [MOVE, CARRY, WORK, WORK]);
            if (Memory.need_energy === undefined) {
                console.log("create: " + name);
                Memory.need_energy = [name];
            } else {
                console.log("Pushed: " + name);
                Memory.need_energy.push(name);
            }
        }

        function SpawnUpgrader() {
            let name = spawn(UPGRADE, [MOVE, CARRY, WORK]);
            if (Memory.need_energy === undefined) {
                console.log("create: " + name);
                Memory.need_energy = [name];
            } else {
                console.log("Pushed: " + name);
                Memory.need_energy.push(name);
            }
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
            if (Memory.need_energy !== undefined) {
                let name = spawn(CARRYER, parts, {pet: Memory.need_energy.shift()});
            } else {
                let name = spawn(CARRYER, parts);
            }
        }

        function SpawnArchitect() {
            let name = spawn(ARCHITECT, [MOVE, MOVE, WORK]);
        }


        //console.log(MINER + "s: " + miners.length + "          " + CARRYER + "ers: " + carryers.length);

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        Memory.ftee_carry = _.map(carryers, function (s) {
            return s.memory.pet.substr(7);
        });


        // console.log("unTaken: " + Memory.ftee_carry.length);
        // Spawner
        if (Memory.init === undefined || Memory.init === false) {
            SpawnArchitect();
            Memory.init = true;
        }

        if (!Spw.spawning) {
            let energy = 0;
            _.forEach(Spw.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                        return structure.store[RESOURCE_ENERGY];
                }
            }), (s) => energy += s.store[RESOURCE_ENERGY]);
            //console.log(energy);
            //if (energy < 250) return;

            let miners = _.filter(Game.creeps, (creep) => creep.memory.action == MINER);
            let carryers = _.filter(Game.creeps, (creep) => creep.memory.action == CARRYER);

            if (miners.length < MINERS && miners.length < carryers.length) {
                SpawnMiner();
                return;
            }
            let upgraderes = _.filter(Game.creeps, (creep) => creep.memory.action == UPGRADE);
            if (upgraderes.length < UPGRADERS && upgraderes.length < carryers.length) {
                SpawnUpgrader();
                return;
            }
            if (carryers.length < CARRYERS) {
                SpawnCarry(carryers.length, energy);
                return;
            }
            if (energy >= 300) {
                let builders = _.filter(Game.creeps, (creep) => creep.memory.action == BUILDER);
                if (Spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && builders.length < BUILDERS) {
                    SpawnBuilder();
                    return;
                }
            }
        }
        for (let name in Memory.creeps)
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
    }
};

module.exports = spawnner;