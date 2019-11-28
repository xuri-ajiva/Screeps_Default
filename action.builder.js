let upgrade = {
    run: function (creep) {
        let construct = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (construct !== undefined) {
            let ret =creep.build(construct);
            if (ret === ERR_NOT_IN_RANGE) {
                creep.moveTo(construct);
            }
        } else{
            console.log("Resycle");
            if(Memory.Spw.recycleCreep(creep) === ERR_NOT_IN_RANGE){
                creep.moveTo(Memory.Spw);
            }
        }

    }
};

module.exports = upgrade;