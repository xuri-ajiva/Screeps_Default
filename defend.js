const max_hits = 100000;

let tower = {
    /** @param {Room} room
     **/
    run: function (room) {
        let enemy = room.find(FIND_HOSTILE_CREEPS);
        if (enemy.length > 0) {
            let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(enemy[0]));

            console.log('defending: ' + towers.length + enemy[0].pos);
        } else {
            let ramp = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_RAMPART && s.hits < max_hits});
            ramp.sort((a, b) => a.hits - b.hits);
            if (ramp.length > 0) {
                let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                towers.forEach(tower => tower.repair(ramp[0]));
            } else {
                let creeps = room.find(FIND_CREEPS, {filter: (c) => c.hits < c.hitsMax});
                creeps.sort((a, b) => a.hits - b.hits);
                if (creeps.length > 0) {
                    let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                    towers.forEach(tower => tower.heal(creeps[0]));
                }
            }
        }
    }

};

module.exports = tower;