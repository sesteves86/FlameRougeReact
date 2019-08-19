class GameEngine {
    constructor(){
        this.decision1 = 0;
        this.decision2 = 0;
        this.decisions = [];
    }

    setHumanDecision(isMain, value) {
        var activePlayer = 0;
        
        if (isMain) {
            this.decision1 = value;
        } else {
            this.decision2 = value;
            // Temporary fix. Will ensure that there's no UI update while processing JS
            activePlayer = 1;
        }

        return {
            activePrimaryRider: !isMain,
            activePlayer: activePlayer
        }
    }

    processRestOfTurn(stateUpdate, riders) {
        this._getAIDecisions();
        stateUpdate.riders = this._processDecisions(riders);
        stateUpdate = this._processTurn(stateUpdate);
        this._resetDecisions();

        console.log(stateUpdate);

        return stateUpdate;
    }

    /* Private functions*/

    _getAIDecisions() {
        this.decisions.push({player: 0, isMain: true, decision: this.decision1});
        this.decisions.push({player: 0, isMain: false, decision: this.decision2});

        //Need to have access to players data to make AI decisions?
        for (var p = 1; p < 4; p++) { // foreach AI
            
            // this.props.rider1[0].shuffle();
            // this.props.rider2[0].shuffle();

            // var options1 = this.props.rider1[0].getTopCard();
            // var options2 = this.props.rider2[0].getTopCard();

            // this.decisions.push({player: p, isMain: true, decision: options1});
            // this.decisions.push({player: p, isMain: false, decision: options2});
            this.decisions.push({player: p, isMain: true, decision: 2});
            this.decisions.push({player: p, isMain: false, decision: 2});
        }
        
    }

    _processDecisions(riders) {
        var trackPosition = [];

        for (var player=0; player<4; player++) {
            for (var isMain = 0; isMain < 2; isMain++) {
                var rider = riders.filter( r => 
                    r.getPlayer() === player && 
                    r.getPrimary() == isMain
                )[0];

                var decision = this.decisions.filter( d => 
                        d.player === player &&
                        d.isMain === isMain);
            
                rider.useCard(decision.decision);

                trackPosition.push({
                    player: player,
                    isMain: isMain,
                    position: rider.positionX
                });
            }
        }

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
                d.isMain === rider.isPrimary)[0].decision;
            
            rider.useCard(decision);

            var targetPosition = rider.positionX + decision;
            var finishLoop = false;
            
            do{
                if (trackPosition.filter( t =>
                    t.position === targetPosition
                ).length < 2 ){
                    rider.setPosition(targetPosition);
                    finishLoop = true;
                } else { // can't move there
                    targetPosition--;
                    if(targetPosition <=0){
                        finishLoop = true;
                    }
                }
            } while (!finishLoop)
        }, this);

        // drag riders

        // fatigue riders

        // shuffle?

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

export default GameEngine;