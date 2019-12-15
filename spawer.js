const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';
const CARRYERS = 4; //(+1)
const MINERS = 7;
const BUILDERS = 4;
const UPGRADERS = 4;
const REPAIRS = 4;
const SPAENHELPERS = 4;

module.exports = {
    Check: function (game, spw) {
        if (spw.memory.query && spw.memory.query.length > 0) {
            let c = Game.creeps[spw.memory.query.pop()];
            if (c) {
                spw.memory.need_energy.push(c.id);
            }
        }

        for (let name in spw.memory.creeps) {
            if (!Game.creeps[name]) {
                if (name.includes('attack'))
                    spw.memory.creeps_count_by_action[ATTACKE] -= 1;
                delete spw.memory.creeps[name];
                console.log('✝: ' + name);
            }
        }

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        spw.memory.pets = _.map(carryers, function (s) {
            return s.memory.pet;
        });

        if (!spw.spawning) {
            let energy = spw.room.energyAvailable;
            //console.log(energy);
            //if (energy < 250) return;
            spw.room.visual.text('⚡' + energy + '⚡',
                spw.pos.x - .7, spw.pos.y,
                {align: 'left', opacity: 1, color: '#ff00f5', font: .3});

            let c_UPGRADE = spw.memory.creeps_count_by_action[UPGRADE];
            let c_MINER = spw.memory.creeps_count_by_action[MINER];
            let c_CARRYER = spw.memory.creeps_count_by_action[CARRYER] - 1;
            let c_REPAIR = spw.memory.creeps_count_by_action[REPAIR];
            let c_LOOTER = spw.memory.creeps_count_by_action[LOOTER];
            let c_BUILDER = spw.memory.creeps_count_by_action[BUILDER];
            let c_SPAENHELPER = spw.memory.creeps_count_by_action[SPAWNHELPER];


            if (energy < 200) return;
            if (c_MINER < MINERS && CARRYERS > 0) {
                let name = spw.SpawnCustomCreep(energy, MINER);
                spw.memory.creeps_count_by_action[MINER] += 1;
            } else if (c_CARRYER < CARRYERS) {
                spw.SpawnCustomCreep(energy, CARRYER);
                spw.memory.creeps_count_by_action[CARRYER] += 1;
            } else if (c_UPGRADE < UPGRADERS) {
                let name = spw.SpawnCustomCreep(energy, UPGRADE);
                spw.memory.creeps_count_by_action[UPGRADE] += 1;
            } else if (c_SPAENHELPER < SPAENHELPERS && spw.room.energyCapacityAvailable > 300) {
                let name = spw.SpawnCustomCreep(energy, SPAWNHELPER);
                spw.memory.creeps_count_by_action[SPAWNHELPER] += 1;
            } else if (spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && c_BUILDER < BUILDERS) {
                if (energy < 300) return;
                let name = spw.SpawnCustomCreep(energy, BUILDER);
                spw.memory.creeps_count_by_action[BUILDER] += 1;
            } else if (c_REPAIR < REPAIRS) {
                let name = spw.SpawnCustomCreep(energy, REPAIR);
                spw.memory.creeps_count_by_action[REPAIR] += 1;
            }

            /* else if (c_LOOTER < 1 && c_LOOTER < c_CARRYER && (spw.room.find(FIND_RUINS, {
                filter: (structure) => {
                    return structure.store[RESOURCE_ENERGY] > 0;
                }
            }).length > 0 || spw.room.find(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return structure.ticksToDecay > 30;
                }
            }).length > 0)) {
                spw.SpawnCustomCreep(energy, LOOTER);
                spw.memory.creeps_count_by_action[LOOTER] += 1;
            }*/
        } else {
            spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
                spw.pos.x + 1, spw.pos.y,
                {align: 'left', opacity: 0.7});
        }
    }
};
