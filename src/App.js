import React, { useState, Fragment } from 'react';
import GameEngine from './Components/GameEngine';
import Help from './Components/Help';
import Game from './Components/Game';
import StartingMenu from './Components/StartingMenu';
import Player from './Components/Player';
import Rider from './Components/Rider';
import SplashScreen from './Components/SplashScreen';
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

    const initialRidersPosition = [
        new Rider( 0 , 3, 0, "Sprinter"),
        new Rider( 0 , 0, 1, "Rouller"),
        new Rider( 1 , 2, 0, "Sprinter"),
        new Rider( 1 , 1, 1, "Rouller"),
        new Rider( 2 , 1, 0, "Sprinter"),
        new Rider( 2 , 2, 1, "Rouller"),
        new Rider( 3 , 0, 0, "Sprinter"),
        new Rider( 3 , 3, 1, "Rouller")
    ]

    const menu = {
        splashScreen: "Splash Screen",
        startingMenu: "Starting Menu",
        game: "Game",
        rules: "Rules",
        winner: "Winner"
    };

    const [ activePlayer, setActivePlayer] = useState(0);
    const [ activePrimaryRider, setActivePrimaryRider] = useState(true); //ToDo: Rename
    const [ gameEngine, setGameEngine] = useState(new GameEngine());
    const [ hasFinished, setHasFinished] = useState(false);
    const [ activeScreen, setActiveScreen] = useState(menu.game);
    // const [ activeScreen, setActiveScreen] = useState(menu.splashScreen);
    const [ riders, setRiders] = useState(initialRidersPosition);
    const [ trackHills, setTrackHills] = useState({
        up: [15, 40],
        down: [10, 45]
    });
    const [ winner, setWinner] = useState(5);

    const resetRace = () => {
        setRiders(initialRidersPosition);
        
        riders.forEach(rider => {
            rider.reset();
        });
    }

    const makeDecision = (key, value) => {
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
            // stateUpdate.hasFinished = true;
            // stateUpdate.winner = winningPlayer;
            setHasFinished(true)
            setWinner(winningPlayer);
            setActiveScreen(menu.winner);
        }

        console.log("Finished making decision");
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

    return (
        <div className="App">
            <img className="backgroundImage" src={require('./Images/flameRougeBackground.png')} alt="background"/>
            <h1 className="mainTitle">Flame Rouge</h1>
            <Game />

            {/* {activeScreen === menu.splashScreen && 
                <SplashScreen 
                    setActiveScreen = {setActiveScreen}
                    menu = {menu}
                />
            }
            {activeScreen === menu.startingMenu && 
                <StartingMenu
                    setActiveScreen = {setActiveScreen}
                    menu = {menu}
                />
            }

            {activeScreen === menu.game && 
                <Fragment>
                    <Track 
                        riders = {riders}
                        trackHills = {trackHills}
                    />
                    <div className = "playersContainer" >
                        { renderedPlayers }
                </div>
                </Fragment>
            }

            {activeScreen === menu.winner && 
                <WinnerScreen
                    hasFinished = {hasFinished}
                    winningPlayer = {winner}
                    riders = {riders}
                    setActiveScreen = {setActiveScreen}
                    menu = {menu}
                    resetRace = {resetRace}
                />
            }

            {activeScreen === menu.rules && 
                <Help
                    setActiveScreen = {setActiveScreen}
                    activeScreen = {activePlayer}
                    menu = {menu}
                />
            } */}
        </div>
    );
});

export default App;
