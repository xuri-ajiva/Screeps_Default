let tower = {
    /** @param {Room} room
     **/
    run: function (room) {
        let enemy = room.find(FIND_HOSTILE_CREEPS);
        if (enemy.length > 0) {
            let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(enemy[0]));

            console.log('defending: '+ towers.length + enemy[0].pos);
        }
    }

};

module.exports = tower;