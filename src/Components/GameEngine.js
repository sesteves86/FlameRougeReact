import Rider from './Rider';

class GameEngine {
    constructor(){
        this.decision1 = 0;
        this.decision2 = 0;
        this.decisions = [];
    }

    setHumanDecision(isSprinter, value) {
        var activePlayer = 0;
        
        if (isSprinter) {
            this.decision1 = value;
        } else {
            this.decision2 = value;
            // Temporary fix. Will ensure that there's no UI update while processing JS
            activePlayer = 1;
        }

        return {
            activePrimaryRider: !isSprinter,
            activePlayer: activePlayer
        }
    }

    processRestOfTurn(stateUpdate, riders) {
        console.log("processRestOfTurn");
        this._getAIDecisions(riders);
        
        var ridersDeepCopy =_deepCopyRiders(riders);
        console.log(riders);
        console.log(ridersDeepCopy);
        stateUpdate.riders = this._processDecisions(ridersDeepCopy);
        console.log(stateUpdate.riders); // Prototype functions are not being passed
        stateUpdate = this._processTurn(stateUpdate);
        this._resetDecisions();

        console.log("End of processRestOfTurn");

        return stateUpdate;
    }

    /* Private functions*/

    _getAIDecisions(riders) {
        this.decisions.push({player: 0, isSprinter: true, decision: this.decision1});
        this.decisions.push({player: 0, isSprinter: false, decision: this.decision2});

        //Need to have access to players data to make AI decisions?
        for (var p = 1; p < 4; p++) { // foreach AI
            
            var cards1 = riders.filter(r => 
                r.player === p 
                && r.isSprinter == true
            )[0].cards;
            var cardChosenIndex1 = Math.floor(Math.random() * cards1.length);

            var cards2 = riders.filter(r => 
                r.player === p 
                && r.isSprinter == false
            )[0].cards;
            var cardChosenIndex2 = Math.floor(Math.random() * cards2.length);

            this.decisions.push({player: p, isSprinter: true, decision: cards1[cardChosenIndex2] });
            this.decisions.push({player: p, isSprinter: false, decision: cards2[cardChosenIndex2] });
        }
        
    }

    _processDecisions(riders) {
        // debugger;
        console.log("_processDecisions");
        var trackPosition = [];

        // Use Cards and Write to trackPosition
        for (var player=0; player<4; player++) {
            for (var isSprinter = 0; isSprinter < 2; isSprinter++) {
                var rider = riders.filter( r => 
                    r.player === player && 
                    r.isSprinter == isSprinter
                )[0];

                var decision = this.decisions.filter( d => 
                        d.player === player &&
                        d.isSprinter == isSprinter)[0];
            
                rider.useCard(decision.decision);

                trackPosition.push({
                    player: player,
                    isSprinter: isSprinter,
                    position: rider.positionX
                });
            }
        }
        console.log(riders);

        // Get riders Position
        var sortedRiders = riders.sort( function(r1, r2) {
            var p1 = r1.getPosition() + r1.getLane()*0.5;
            var p2 = r2.getPosition() + r2.getLane()*0.5;

            return p1-p2;
        });

        // for each rider, move the expected number of squares, if possible
        sortedRiders.forEach( function(rider) {
            var decision = this.decisions.filter( d => 
                d.player === rider.player &&
                d.isSprinter === rider.isSprinter)[0].decision;

            var targetPosition = rider.positionX + decision;
            var finishLoop = false;
            
            do { // crawl should be done from back to front, as riders can't pass blocked paths
                if (trackPosition.filter( t =>
                    t.position === targetPosition
                ).length < 2 ){
                    rider.setPosition(targetPosition);
                    var tIndex = trackPosition.findIndex( t =>
                        t.isSprinter == rider.isSprinter && 
                        t.player === rider.player
                        );
                    trackPosition[tIndex].position = targetPosition;
                    finishLoop = true;
                } else { // can't move there
                    targetPosition--;
                    if(targetPosition <=0){
                        finishLoop = true;
                    }
                }
            } while (!finishLoop)
        }, this);
        console.log(riders);

        console.log("drag");
        // drag riders // is it working properly?
        var sortedTrackPositions = trackPosition.sort(
            function(t1, t2) {
                var p1 = t1.position;
                var p2 = t2.position;
    
                return p1-p2; // Ascending order
            }
        );
        // foreach sorted track position
        debugger;
        for (let i = 0; i < 7; i++) {
            var pos = sortedTrackPositions[i].position;
            var nextPos = sortedTrackPositions[i+1].position;
            var testPos;
            // var pos_1 = i > 0 ? sortedTrackPositions[i-1] : -5;

            if (nextPos === pos + 2) { // drag happens
                var lPos = pos;

                // move up current rider
                // update track position
                var riderIndex = riders.findIndex( r => 
                    r.player === sortedTrackPositions[i].player 
                    && r.isSprinter == sortedTrackPositions[i].isSprinter
                )

                console.log("Rider Index: " + riderIndex + " position: " + riders[riderIndex].position + " New position: " + (pos + 1));
                riders[riderIndex].position = pos + 1;

                // update track position
                sortedTrackPositions[i].position = pos + 1;


                for (let j = i-1; j <= 0; j--) {
                    if(j<0){
                        return;
                    }
                    testPos = sortedTrackPositions[j].position;
                    if (testPos === lPos - 2) { //within drag range
                        lPos = testPos;
                        // Move riders
                        var riderIndex = riders.findIndex( r => 
                            r.player === sortedTrackPositions[j].player 
                            && r.isSprinter == sortedTrackPositions[j].isSprinter
                        )

                        console.log("Rider Index: " + riderIndex + " position: " + riders[riderIndex].position + " New position: " + (pos + 1));
                        riders[riderIndex].position = lPos + 1;

                        // update track position
                        sortedTrackPositions[j].position = lPos + 1;
                    }
                }
                if(riders === undefined) {
                    debugger;
                }
                
            }
        }

        console.log(riders);

        // fatigue riders

        return riders;
    }

    _processTurn(stateUpdate) {
        stateUpdate.activePlayer = 0;
        stateUpdate.activePrimaryRider = true;

        return stateUpdate;
    }

    _resetDecisions() {
        this.decision1 = 0;
        this.decision2 = 0;
        this.decisions = [];
    }
}

function _deepCopyRiders(riders) {
    var clonedRiders = [
        new Rider( 0 , 3, 0, true),
        new Rider( 0 , 0, 1, false),
        new Rider( 1 , 2, 0, true),
        new Rider( 1 , 1, 1, false),
        new Rider( 2 , 1, 0, true),
        new Rider( 2 , 2, 1, false),
        new Rider( 3 , 0, 0, true),
        new Rider( 3 , 3, 1, false)
    ];

    clonedRiders.forEach(function(clonedRider) {
        var originalRider = riders.filter( r => 
            r.isSprinter == clonedRider.isSprinter &&
            r.player == clonedRider.player);

        var deepCopy = _deepCopyObject(originalRider[0]);

        clonedRider.cards = deepCopy.cards;
        clonedRider.cardsDiscarded = deepCopy.cardsDiscarded;
        clonedRider.nextMove = deepCopy.nextMove;
        clonedRider.positionX = deepCopy.positionX;
    }, this);

    return clonedRiders;
}

function _deepCopyObject(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = _deepCopyObject(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _deepCopyObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export default GameEngine;