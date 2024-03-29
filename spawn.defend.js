const max_hits = 100000;

let tower = {
    /** @param {Room} room
     **/
    run: function (room, spw) {
        let enemy = room.find(FIND_HOSTILE_CREEPS);
        if (enemy.length > 0) {
            let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(enemy[0]));

            console.log('defending: ' + towers.length + enemy[0].pos);

            let c_ATTACKER = spw.memory.creeps_count_by_action['attack'];
            if (c_ATTACKER < 4 && !spw.spawning) {
                spw.SpawnCustomCreep(spw.room.energyAvailable, 'attack');
                spw.memory.creeps_count_by_action['attack'] += 1;
            }


        } else if(spw.memory.creeps_count_by_action) {
            if (spw.memory.creeps_count_by_action['attack'] > 0) {
                for (let c in Game.creeps) {
                    if (Game.creeps[c].memory.action === 'attack') {
                        require('special.renew').reNewCreep(Game.creeps[c], spw);
                    }
                }
            }

            let creeps = room.find(FIND_CREEPS, {filter: (c) => c.hits < c.hitsMax});
            creeps.sort((a, b) => a.hits - b.hits);
            if (creeps.length > 0) {
                let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                towers.forEach(tower => tower.heal(creeps[0]));
            } else {
                let ramp = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_RAMPART) && s.hits < max_hits && s.hits < s.hitsMax});
                ramp.sort((a, b) => a.hits - b.hits);
                if (ramp.length > 0) {
                    let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                    towers.forEach(tower => tower.repair(ramp[0]));
                } else {
                    let road = room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_ROAD) && s.hits < max_hits && s.hits < s.hitsMax});
                    road.sort((a, b) => a.hits - b.hits);
                    if (road.length > 0) {
                        let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                        let rep = require('action.repair');
                        let tar = rep.repairRoads(spw, spw.room);
                        if (tar !== undefined) {
                            let obj = Game.getObjectById(tar);
                            towers.forEach(tower => tower.repair(obj));
                        }
                    }
                }
            }
        }
    }

};

module.exports = tower;