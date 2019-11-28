const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const CARRYERS = 14;
const MINERS = 7;
const BUILDERS = 6;


var spawnner = {
    Check: function (game) {
        let spawn = function (obj, ls, adj) {
            var newName = obj + Game.time;
            if (adj) {
                let memory = Object.assign({}, {action: obj}, adj);
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Memory.Spw.spawnCreep(ls, newName, {
                    memory
                }));
            } else {
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Memory.Spw.spawnCreep(ls, newName, {memory: {action: obj}}));
            }
            return newName;
        };

        function SpawnMiner() {
            let name = spawn(MINER, [WORK, MOVE, WORK], {
                source: Memory.Spw.room.find(FIND_SOURCES)[parseInt(Math.random() * 1)].id,
                count: 0
            });
        }

        function SpawnBuilder() {
            let name = spawn(BUILDER, [MOVE, CARRY, CARRY, WORK]);
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

        function SpawnCarry() {
            if (Memory.need_energy !== undefined) {
                let name = spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY], {my_proiryty: Memory.need_energy.shift()});
            } else {
                let name = spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY]);
            }
        }

        function SpawnArchitect() {
            let name = spawn(ARCHITECT, [MOVE, MOVE, WORK]);
        }


        //console.log(MINER + "s: " + miners.length + "          " + CARRYER + "ers: " + carryers.length);

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.my_proiryty !== undefined);
        Memory.ftee_carry = _.filter(carryers, function (s) {
            return s.memory.my_proiryty.name;
        });

        // console.log("unTaken: " + Memory.ftee_carry.length);
        // Spawner
        if (Memory.init === undefined || Memory.init === false) {
            SpawnArchitect();
            Memory.init = true;
        }

        if (Memory.Spw.store[RESOURCE_ENERGY] > 250 && !Memory.Spw.spawning) {
            let miners = _.filter(Game.creeps, (creep) => creep.memory.action == MINER);
            let carryers = _.filter(Game.creeps, (creep) => creep.memory.action == CARRYER);
            let upgraderes = _.filter(Game.creeps, (creep) => creep.memory.action == UPGRADE);
            let builders = _.filter(Game.creeps, (creep) => creep.memory.action == BUILDER);

            if (miners.length < MINERS && miners.length < carryers.length) {
                SpawnMiner();
                return;
            }
            if (upgraderes.length < carryers.length - BUILDERS) {
                SpawnUpgrader();
                return;
            }
            if (carryers.length < CARRYERS) {
                SpawnCarry();
                return;
            }
            if (Memory.Spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && builders.length < BUILDERS) {
                SpawnBuilder();
                return;
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