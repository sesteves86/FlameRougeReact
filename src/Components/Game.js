import React, {Fragment, useState, useEffect} from "react";
import GameEngine from "./GameEngine";
import Player from "./Player";
import Rider from "./Rider";
import Track from "./Track";

const Game = () => {
    let gameEngine = {};

    const [ activePlayer, setActivePlayer] = useState(0);
    const [ activeRider, setActiveRider] = useState(0);
    const [ riders, setRiders] = useState([
        new Rider( 0, 0 , 3, 0, "Sprinter"),
        new Rider( 1, 0, 0, 1, "Rouller"),
        new Rider( 2, 1 , 2, 0, "Sprinter"),
        new Rider( 3, 1 , 1, 1, "Rouller"),
        new Rider( 4, 2 , 1, 0, "Sprinter"),
        new Rider( 5, 2 , 2, 1, "Rouller"),
        new Rider( 6, 3 , 0, 0, "Sprinter"),
        new Rider( 7, 3 , 3, 1, "Rouller")
    ]);
    const [ trackHills, setTrackHills] = useState({
        up: [15, 40],
        down: [10, 45]
    });
    const players = [
        {
            id: 0,
            isHuman: true
        }, {
            id: 1,
            isHuman: false
        }, {
            id: 2,
            isHuman: false
        }, {
            id: 3,
            isHuman: false
        }
    ];

    useEffect(() => {
        gameEngine = new GameEngine();
    }, []);

    const makeDecision = (riderId, value) => {
        // not human
        if (!activePlayer === 0) { 
            return;
        }

        let newState = {}; // ToDo: deep copy of current state

        // if()

        // if (activePrimaryRider === true) {
        //     newState = this.gameEngine.setHumanDecision(true, value);
        // } else {
        //     newState = this.gameEngine.setHumanDecision(false, value);
        //     newState = this.gameEngine.processRestOfTurn(newState, riders, trackHills);

        //     setRiders(newState.riders);
        // }

        // setActivePrimaryRider(newState.activePrimaryRider);
        // setActivePlayer(newState.activePlayer);

        // var maxPosition = Math.max.apply(Math, riders.map(function(o) { return o.positionX; }));
        // var winningPlayer = riders.filter( r => r.positionX === maxPosition)[0].player;

        // if (maxPosition >= 70) {
        //     // stateUpdate.hasFinished = true;
        //     // stateUpdate.winner = winningPlayer;
        //     setHasFinished(true)
        //     setWinner(winningPlayer);
        //     setActiveScreen(menu.winner);
        // }

        // console.log("Finished making decision");
    };

    return (
        <Fragment>
            <Track 
                riders = {riders}
                trackHills = {trackHills}
            />
            <h1>Test Game</h1>
            <div className = "playersContainer" >
                { players.map( p => (
                    <Player
                        key = { p.id }
                        player = { p.id } 
                        isHuman = {p.isHuman}
                        riders = { riders.filter(r => r.player === p.id)}
                        makeDecision = { makeDecision }
                        activePlayer = { activePlayer }
                        activeRider = { activeRider }
                        // hasFinished = { hasFinished}
                    />
                )) }
                {/* { renderedPlayers } */}
            </div>
        </Fragment>
    )
};

export default Game;