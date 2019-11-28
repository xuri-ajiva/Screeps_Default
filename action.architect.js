let architect = {
    run: function (creep) {
        if (creep.memory.paths === undefined) {
            let begin = Memory.Spw.pos;


            let fin = [];
            var resor = creep.room.find(FIND_SOURCES);
            resor.push(Memory.Spw.room.controller);
            for (let gx in resor) {
                let ret = PathFinder.search(
                    begin, resor[gx],
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

                            // room.find(FIND_CREEPS).forEach(function (creep) {
                            //     costs.set(creep.pos.x, creep.pos.y, 0xff);
                            // });

                            return costs;
                        },
                    }
                )
                fin.push(ret.path);
            }

            creep.memory.paths = fin;
            for (let g in fin)
                for (let p in fin[g]) {
                    creep.room.createConstructionSite(fin[g][p], STRUCTURE_ROAD);
                }

            let places = [];
            places.push({x: 3, y: 2});
            places.push({x: -3, y: 2});
            places.push({x: 2, y: 3});
            places.push({x: -2, y: 3});
            places.push({x: 3, y: -2});
            places.push({x: -3, y: -2});
            places.push({x: 2, y: -3});
            places.push({x: -2, y: -3});

            for (let p in places) {
                creep.room.createConstructionSite(Memory.Spw.pos.x + places[p].x, Memory.Spw.pos.y + places[p].y, STRUCTURE_EXTENSION);
            }
            places = [];
            for (let x = -2; x < 3; x++) {
                for (let y = -2; y < 3; y++) {
                    places.push({x: x, y: y})
                }
            }
            for (let p in places) {
                creep.room.createConstructionSite(Memory.Spw.pos.x + places[p].x, Memory.Spw.pos.y + places[p].y, STRUCTURE_ROAD);
            }
        } else {
            Memory.Spw.recycleCreep(creep);
            console.log("resycle!");
            // let cs = creep.room.find(FIND_STRUCTURES);
            // for (let c in cs) {
            //     //console.log(cs[c]);
            //     if (cs[c].structureType === STRUCTURE_ROAD ) {
            //         cs[c].destroy();
            //     }
            // }
            // cs = creep.room.find(FIND_CONSTRUCTION_SITES);
            // for (let c in cs) {
            //     if (cs[c].structureType === STRUCTURE_ROAD ) {
            //         cs[c].destroy();
            //     }
            // }
        }
    }
};

module.exports = architect;