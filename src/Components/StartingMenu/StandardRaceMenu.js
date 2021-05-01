import React, { Fragment, useState } from "react";
import random from "random";
import arrayOrdering from "../../Utilities/ArrayOrdering";

const StandardRaceMenu = ({menu, setActiveScreen, setTrackHills, setPlayers}) => {

    const [nUpHills, setNUpHills] = useState(2);
    const [nDownHills, setNDownHills] = useState(2);
    const [nDifficulty, setNDifficulty] = useState(0);
    const [nHumans, setNHumans] = useState(1);
    const [totalPlayers, setTotalPlayers] = useState(4);

    const onUpHillsChange = (e) => {
        const nUpHill = e.target.value;

        setNUpHills(nUpHill);
    }
    const onDownHillsChange = (e) => {
        const nDownHill = e.target.value;

        setNDownHills(nDownHill);
    }
    const onDifficultyChange = (e) => {
        const newDifficulty = e.target.value;

        setNDifficulty(newDifficulty);
    }

    const onTotalPlayersChange = (e) => {
        const newTotalPlayers = e.target.value;

        setTotalPlayers(newTotalPlayers);
    }

    const onNHumansChange = e => {
        setNHumans(e.target.value);
    }

    const onGameStart = () => {
        const trackHills = {
            up:[],
            down:[]
        };

        const trackLength = 70;
        const nHillSegments = trackLength / 5; //14

        let segments = [];
        for (let i = 0; i < nHillSegments; i++) {
            segments.push(i);
        }

        const shuffledSegments = arrayOrdering.shuffleArray(segments); 

        for (let i = 0; i < nUpHills; i++) {
            trackHills.up.push(shuffledSegments[0]*5);
            shuffledSegments.splice(0,1);
        }
        for (let i = 0; i < nDownHills; i++) {
            trackHills.down.push(shuffledSegments[0]*5);
            shuffledSegments.splice(0,1);
        }

        setTrackHills(trackHills);
        const players = [];
        // for each total players, create new object and assign isHuman: true while id < nHumans
        for(let i = 0; i< totalPlayers; i++) {
            const playerObj = {
                id: i,
                isHuman: i<nHumans
            };

            players.push(playerObj);
        }
        setPlayers(players);
        setActiveScreen(menu.game);
    }

    return (
        <Fragment>
            <h1>Standard Game Menu</h1>
            <div className="standardRaceMenu__container">
                <label className="standardRaceMenu__label">Difficulty</label>
                <input type="number" className="standardRaceMenu__input" onChange={onDifficultyChange} value={nDifficulty}/>
            
                <label className="standardRaceMenu__label">Number Human Players</label>
                <input type="number" className="standardRaceMenu__input" onChange={onNHumansChange} value={nHumans}/>
            
                <label className="standardRaceMenu__label">Total Players</label>
                <input type="number" className="standardRaceMenu__input" onChange={onTotalPlayersChange} value={totalPlayers}/>
            
                <label className="standardRaceMenu__label">UpHills</label>
                <input type="number" className="standardRaceMenu__input" onChange={onUpHillsChange} value={nUpHills}/>
            
                <label className="standardRaceMenu__label">DownHills</label>
                <input type="number" className="standardRaceMenu__input" onChange={onDownHillsChange} value={nDownHills}/>
            </div>
            <button type="button" onClick={onGameStart} >StartRace</button>
            <button type="button" onClick={()=> {setActiveScreen(menu.startingMenu)}} >Back</button>
        </Fragment>
    )
};

export default StandardRaceMenu;