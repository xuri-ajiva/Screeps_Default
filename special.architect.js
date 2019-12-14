let architect = {

    findPath: function (coreLevel, spw, ignore_creeps) {
        let begin = spw.pos;


        let fin = [];
        let resources = spw.room.find(FIND_SOURCES);
        resources.push(spw.room.controller);
        for (let i in resources) {
            let ret = PathFinder.search(
                begin, resources[i],
                {
                    plainCost: 2,
                    swampCost: 10,

                    roomCallback: function (roomName) {
                        let room = Game.rooms[roomName];
                        if (!room) return;
                        let costs = new PathFinder.CostMatrix;

                        room.find(FIND_STRUCTURES).forEach(function (struct) {
                            if (struct.structureType === STRUCTURE_ROAD) {
                                costs.set(struct.pos.x, struct.pos.y, 1);
                            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                                (struct.structureType !== STRUCTURE_RAMPART ||
                                    !struct.my)) {
                                costs.set(struct.pos.x, struct.pos.y, 0xff);
                            }
                        });

                        // Avoid creeps in the room
                        if (!ignore_creeps)
                            room.find(FIND_CREEPS).forEach(function (creep) {
                                costs.set(creep.pos.x, creep.pos.y, 0xff);
                            });

                        return costs;
                    },
                }
            );
            fin.push(ret.path);
        }
        return fin;
    },

    /** @param {Number} coreLevel
     *  @param {Spawn} spw
     **/
    run: function (coreLevel, spw) {

        let fin = this.findPath(coreLevel,spw,false);

        for (let g in fin)
            for (let p in fin[g]) {
                spw.room.createConstructionSite(fin[g][p], STRUCTURE_ROAD);
            }

        let places = [];
        for (let j = -3; j < 4; j++)
            for (let k = -3; k < 4; k++) {
                if (Math.abs(j) === 3 && Math.abs(k) === 2 || Math.abs(j) === 2 && Math.abs(k) === 3) {
                    places.push({x: j, y: k});
                }
            }

        // places.push({x: 3, y: 2});
        // places.push({x: -3, y: 2});
        // places.push({x: 2, y: 3});
        // places.push({x: -2, y: 3});
        // places.push({x: 3, y: -2});
        // places.push({x: -3, y: -2});
        // places.push({x: 2, y: -3});
        // places.push({x: -2, y: -3});

        // for (let p in places) {
        //     spw.room.createConstructionSite(spw.pos.x + places[p].x, spw.pos.y + places[p].y, STRUCTURE_EXTENSION);
        // }
        places = [];
        for (let x = -2; x < 3; x++) {
            for (let y = -2; y < 3; y++) {
                places.push({x: x, y: y})
            }
        }
        for (let p in places) {
            spw.room.createConstructionSite(spw.pos.x + places[p].x, spw.pos.y + places[p].y, STRUCTURE_ROAD);
        }
    }
};

module.exports = architect;