import React, { useState } from 'react';
import GameEngine from './Components/GameEngine';
import Help from './Components/Help';
import Player from './Components/Player';
import Rider from './Components/Rider';
import Track from './Components/Track';
import WinnerScreen from './Components/WinnerScreen';
import './App.css';

const App = ( () => {

    const players= 
    [
        {
            id: 0,
            human: true
        },
        {
            id: 1,
            human: false
        },
        {
            id: 2,
            human: false
        },
        {
            id: 3,
            human: false
        }
    ];

    const [ activePlayer, setActivePlayer] = useState(0);
    const [ activePrimaryRider, setActivePrimaryRider] = useState(true);
    const [ gameEngine, setGameEngine] = useState(new GameEngine());
    const [ hasFinished, setHasFinished] = useState(false);
    const [ helpMenu, setHelpMenu] = useState(false);
    const [ riders, setRiders] = useState([
        new Rider( 0 , 3, 0, true),
        new Rider( 0 , 0, 1, false),
        new Rider( 1 , 2, 0, true),
        new Rider( 1 , 1, 1, false),
        new Rider( 2 , 1, 0, true),
        new Rider( 2 , 2, 1, false),
        new Rider( 3 , 0, 0, true),
        new Rider( 3 , 3, 1, false)
    ]);
    const [ trackHills, setTrackHills] = useState({
        up: [15, 40],
        down: [10, 45]
    });
    const [ winner, setWinner] = useState(5);

    const makeDecision = (key, value) => {
        console.log("makeDecision()");
        
        // not human
        if (!activePlayer === 0) { 
            return;
        }

        let stateUpdate = {};

        if (activePrimaryRider === true) {
            stateUpdate = gameEngine.setHumanDecision(true, value);
        } else {
            stateUpdate = gameEngine.setHumanDecision(false, value);
            stateUpdate = gameEngine.processRestOfTurn(stateUpdate, riders, trackHills);

            setRiders(stateUpdate.riders);
        }

        setActivePrimaryRider(stateUpdate.activePrimaryRider);
        setActivePlayer(stateUpdate.activePlayer);

        var maxPosition = Math.max.apply(Math, riders.map(function(o) { return o.positionX; }));
        var winningPlayer = riders.filter( r => r.positionX === maxPosition)[0].player;

        if (maxPosition >= 70) {
            stateUpdate.hasFinished = true;
            stateUpdate.winner = winningPlayer;
        }

        console.log("Finished making decision");
    };

    const toggleHelp = () => {
        setHelpMenu(!helpMenu);
    };

    const renderedPlayers = players.map( (p) => (
        <Player
            key = { p.id }
            player = { p } 
            rider1 = { riders.filter( r => r.player === p.id && r.isSprinter === true )[0] } 
            rider2 = { riders.filter( r => r.player === p.id && r.isSprinter === false )[0] }
            makeDecision = { makeDecision }
            activePlayer = { activePlayer }
            activePrimaryRider = { activePrimaryRider }
            hasFinished = { hasFinished}
        />
    ), this);

    var playerContainerClassName = "playersContainer " + (helpMenu ? "hidden" : "");

    return (
        <div className="App">
            <img className="backgroundImage" src={require('./Images/flameRougeBackground.png')} alt="background"/>
            <h1 className="mainTitle">Flame Rouge</h1>

            <Track 
                riders = {riders}
                trackHills = {trackHills}
                helpMenu = {helpMenu}
            />
            <div className = {playerContainerClassName} >
                { renderedPlayers }
            </div>

            <WinnerScreen
                hasFinished = {hasFinished}
                winningPlayer = {winner}
                riders = {riders}
                helpMenu = {helpMenu}
            />

            <Help
                helpMenu = {helpMenu}
                toggleHelp = {toggleHelp}
            />
        </div>
    );
});

export default App;
