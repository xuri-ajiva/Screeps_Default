module.exports = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        let enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if(enemy){
        if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
            creep.say('💢');
            creep.moveTo(enemy);
        }}
        else{creep.moveTo(spw.pos.x + 7,spw.pos.y - 8);}

    }
};