const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';

var spawnner = {
    Check: function (game) {
        let spawn = function (obj, ls, adj) {
            var newName = obj + Game.time;
            if (adj) {
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Memory.Spw.spawnCreep(ls, newName, {
                    memory: {action: obj},
                    adj
                }));
            } else {
                console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Memory.Spw.spawnCreep(ls, newName, {memory: {action: obj}}));
            }
            return newName;
        };

        function SpawnMiner() {
            let name = spawn(MINER, [WORK, MOVE, WORK], undefined);
        }

        function SpawnUpgrader() {
            spawn(UPGRADE, [MOVE, CARRY, WORK]);
            if (Memory.need_energy === undefined) {
                Memory.need_energy = [name];
            } else {
                Memory.need_energy.push(name);
            }
        }

        function SpawnCarry() {
            if (Memory.need_energy !== undefined) {
                let name = spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY], {my_proiryty: Memory.need_energy.shift()});
            }else{
                let name = spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY]);
            }
        }

        let miners = _.filter(Game.creeps, (creep) => creep.memory.action == MINER);
        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action == CARRYER);
        let upgraderes = _.filter(Game.creeps, (creep) => creep.memory.action == UPGRADE);

        //console.log(MINER + "s: " + miners.length + "          " + CARRYER + "ers: " + carryers.length);

        Memory.ftee_carry = carryers.filter(function (s) {
            return s.memory._owner == undefined
        });

        //console.log("unTaken: " + Memory.ftee_carry.length);
        //Spawner
        if (Memory.Spw.store[RESOURCE_ENERGY] > 250 && !Memory.Spw.spawning) {
            if (miners.length < 1) {

                /*var newName = MINER + Game.time;
                console.log('Spawning new ' + MINER + ': ' + newName);
                Memory.Spw.spawnCreep([WORK, MOVE, WORK], newName, {memory: {action: MINER}});*/
                SpawnMiner();
            } else if (carryers.length < 1) {
                /*var newName = CARRYER + Game.time;
                console.log('Spawning new ' + CARRYER + 'er: ' + newName);
                Memory.Spw.spawnCreep([MOVE, MOVE, CARRY, CARRY], newName, {memory: {action: CARRYER}});*/
                SpawnCarry();
            } else if (miners.length < 2) {
                SpawnMiner();
            } else if (carryers.length < 5) {
                SpawnCarry();
            } else if (upgraderes.length < 4) {
                SpawnUpgrader();
                /*var newName = UPGRADE + Game.time;
                console.log('Spawning new ' + UPGRADE + ': ' + newName);
                Memory.Spw.spawnCreep([MOVE, CARRY, WORK], newName, {memory: {action: UPGRADE}});*/
            }
        }

        if (Memory.creeps.length !== Game.creeps.length) {
            for (let name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
        }
    }
};

module.exports = spawnner;