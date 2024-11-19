var MatterMgr = function() {};

MatterMgr.collisionID = [];
MatterMgr.nextNewPlayer = {};
MatterMgr.collisionCheck = false; 
MatterMgr.collisionInfo = null; 
MatterMgr.seedDownCheck = false; 
MatterMgr.vertexSets = [];
MatterMgr.seedCollisionID = null; 
MatterMgr.comboScoreID = null;


MatterMgr.init = function() 
{
    MatterMgr.engine = Matter.Engine;

    MatterMgr.engineObj = Matter.Engine.create({
        positionIterations: 2,
        velocityIterations: 1,
        constraintIterations: 3,
    });
    
    MatterMgr.composite = Matter.Composite;

    MatterMgr.composites = Matter.Composites; 

    MatterMgr.constraint = Matter.Constraint;

    MatterMgr.events = Matter.Events;

    MatterMgr.bodies = Matter.Bodies;

    MatterMgr.body = Matter.Body;

    MatterMgr.vertices = Matter.Vertices; 

    MatterMgr.common = Matter.Common;

    MatterMgr.world = MatterMgr.engineObj.world;

    MatterMgr.playerCategory = 0x0002;
    MatterMgr.bgWallCategory = 0x0003;
    MatterMgr.topPlayerCategory = 0x0004;

    Matter.Events.on(MatterMgr.engineObj, 'collisionStart', function(event) {

        var pairs = event.pairs;
    
        for(var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var aLabel = pair.bodyA.label;
            var bLabel = pair.bodyB.label;
            var aIdx = pair.bodyA.index; 
            var bIdx = pair.bodyB.index;
            var aPos = pair.bodyA.position;
            var bPos = pair.bodyB.position;
            var aStatic = pair.bodyA.parent.isStatic;
            var bStatic = pair.bodyB.parent.isStatic;

            if (!MatterMgr.collisionCheck) {

                if(aLabel == "player" && bLabel !== "topBG" && !aStatic && bLabel !== "bgWall") {
                    pair.bodyA.label = "playerEnd";
                    MatterMgr.collisionCheck = true; 
                    MatterMgr.collisionInfo = pair.bodyA;
                   
                } else if (bLabel == "player" && aLabel !== "topBG" && !bStatic && aLabel !== "bgWall") {
                    pair.bodyB.label = "playerEnd";
                    MatterMgr.collisionCheck = true; 
                    MatterMgr.collisionInfo = pair.bodyB; 
                }
            }

            // ヒマワリの種チェック
            if ((aIdx == Board.seedPlayerNum && bLabel !== "topBG" ) || (bIdx == Board.seedPlayerNum && aLabel !== "topBG")) {
                MatterMgr.seedDownCheck = true; 
            }


            if (((aIdx === bIdx) || (aIdx === Board.seedPlayerNum  && bIdx !== 20) || (bIdx === Board.seedPlayerNum  && aIdx !== 20)) && !aStatic && !bStatic) {

                if (!("idx" in MatterMgr.nextNewPlayer)) {
                    if(MatterMgr.collisionID.indexOf(pair.bodyA.id) < 0 && MatterMgr.collisionID.indexOf(pair.bodyB.id) < 0)
                    {
                        MatterMgr.collisionID.push(pair.bodyA.id);
                        MatterMgr.collisionID.push(pair.bodyB.id);
                        
                        if(MatterMgr.comboScoreID === pair.bodyA.id || MatterMgr.comboScoreID === pair.bodyB.id) {
                            MatterMgr.nextNewPlayer.combo = MatterMgr.comboScoreID;
                        } else {
                            MatterMgr.nextNewPlayer.combo = null;
                        }

                        if (aIdx !== 11) {
                            MatterMgr.nextNewPlayer.idx = pair.bodyA.index + 1;
                            MatterMgr.nextNewPlayer.pos = {x: (aPos.x + bPos.x) / 2 , y: (aPos.y + bPos.y) / 2};
                            MatterMgr.nextNewPlayer.seedSound = false; 
                            
                            if (bIdx === Board.seedPlayerNum) {
                                MatterMgr.seedCollisionID = pair.bodyA.id;
                                MatterMgr.nextNewPlayer.seedSound = true; 
                            }

                        } else if (bIdx !== 11) {
                            MatterMgr.nextNewPlayer.idx = pair.bodyB.index + 1;
                            MatterMgr.nextNewPlayer.pos = {x: (aPos.x + bPos.x) / 2, y: (aPos.y + bPos.y) / 2};
                            MatterMgr.nextNewPlayer.seedSound = false; 

                            if (aIdx === Board.seedPlayerNum) {
                                MatterMgr.seedCollisionID = pair.bodyB.id;
                                MatterMgr.nextNewPlayer.seedSound = true; 
                            }
                        }
                    } else {
                        // console.log("already in the array");
                    }
                } else {
                    // console.log("simultaneous collision");
                }
            }
        }
    });

}

MatterMgr.update = function()
{
    MatterMgr.engineObj.gravity.y = 55 * SnlFPS.deltaTime; 
    MatterMgr.engine.update(MatterMgr.engineObj);
}

MatterMgr.getBodies = function()
{
    return MatterMgr.composite.allBodies(MatterMgr.world);
}


MatterMgr.addCircle = function( x, y, r, option )
{
    var circle = MatterMgr.bodies.circle(x, y, r, option);

    MatterMgr.composite.add(MatterMgr.world, [circle]);
    return circle;
}

MatterMgr.addSVG = function( x, y, id, option, pos)
{
    var svg = MatterMgr.bodies.fromVertices(x, y, MatterMgr.vertexSets[id], option);
    
    MatterMgr.composite.add(MatterMgr.world, [svg]);
    return svg;
}

MatterMgr.addWall = function( x, y, width, height, option ) 
{
    var wall = MatterMgr.bodies.rectangle(x, y, width, height, option);
    
    MatterMgr.composite.add(MatterMgr.world, [wall]);
    return wall;
}

MatterMgr.destroy = function( body )
{
    MatterMgr.composite.remove( MatterMgr.world, body );
}
