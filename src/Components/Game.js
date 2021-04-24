import React, {Fragment, useState, useEffect} from "react";
import GameEngine from "./GameEngine";
import Player from "./Player";
import Rider from "./Rider";
import Track from "./Track";
import Track2 from "./Track2";

const Game = () => {
    const [ activeRider, setActiveRider] = useState(0);
    const [ riders, setRiders] = useState([
        new Rider( 0, 0 , 3, 0, "Sprinter"),
        new Rider( 1, 0, 0, 1, "Rouller"),
        // new Rider( 8, 0, 4, 0, "Test", [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]),
        new Rider( 2, 1 , 2, 0, "Sprinter"),
        new Rider( 3, 1 , 1, 1, "Rouller"),
        new Rider( 4, 2 , 1, 0, "Sprinter"),
        new Rider( 5, 2 , 2, 1, "Rouller"),
        new Rider( 6, 3 , 0, 0, "Sprinter"),
        new Rider( 7, 3 , 3, 1, "Rouller")
    ]);
    const [ track, setTrackHills] = useState({
        up: [15, 40],
        down: [10, 45]
    });
    const [gameEngine, setGameEngine] = useState({});

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
        if (players && riders && track) {
            setGameEngine(new GameEngine(players, riders, track));
        }
    }, []);

    const getActivePlayer = () => {
        const rider = riders.filter(r => r.id === activeRider)[0];
        const activePlayer = rider.player;

        return activePlayer;
    }

    const makeHumanDecision = (riderId, value) => {
        gameEngine.setHumanDecision(riderId, value);
        gameEngine.processCpuDecisionsUntilNextHumanPlayer(riderId);

        const areMoreHumanRidersThisRound = gameEngine.areMoreHumanPlayersThisRound(riderId);

        if (areMoreHumanRidersThisRound) {
            const nextHumanRiderId = gameEngine.getNextHumanRiderId(riderId);

            setActiveRider(nextHumanRiderId);
        } else {
            processEndOfRound();
        }
    };

    const processEndOfRound = () => {
        gameEngine.processAllDecision();
        const ridersState = gameEngine.getNewRidersState();
        console.log(ridersState);
        setRiders(ridersState);
        setActiveRider(0);

        console.log("End of round");

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
    }

    return (
        <Fragment>
            <Track2 
                riders = {riders}
                trackHills = {track}
            />
            <div className = "playersContainer" >
                { players.map( p => (
                    <Player
                        key = { p.id }
                        player = { p.id } 
                        isHuman = {p.isHuman}
                        riders = { riders.filter(r => r.player === p.id)}
                        makeHumanDecision = { makeHumanDecision }
                        activePlayer = { getActivePlayer() }
                        activeRider = { activeRider }
                        // hasFinished = { hasFinished}
                    />
                )) }
            </div>
        </Fragment>
    )
};

export default Game;