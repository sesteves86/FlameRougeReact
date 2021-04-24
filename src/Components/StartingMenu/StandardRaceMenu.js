import React, { Fragment, useState } from "react";

const StandardRaceMenu = ({menu, setActiveScreen, setTrackHills}) => {

    const [nUpHills, setNUpHills] = useState(2);
    const [nDownHills, setNDownHills] = useState(2);
    const [nDifficulty, setNDifficulty] = useState(0);

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

        //Not good shuffling happening
        const shuffledSegments = segments.sort(() => 0.6 - Math.random());

        for (let i = 0; i < nUpHills; i++) {
            trackHills.up.push(shuffledSegments[0]*5);
            shuffledSegments.splice(0,1);
        }
        for (let i = 0; i < nDownHills; i++) {
            trackHills.down.push(shuffledSegments[0]*5);
            shuffledSegments.splice(0,1);
        }

        console.log(trackHills);

        setTrackHills(trackHills);
        
        setActiveScreen(menu.game);
    }

    return (
        <Fragment>
            <h1>Standard Game Menu</h1>
            <label>Difficulty</label>
            <input type="text" onChange={onDifficultyChange} value={nDifficulty}/>
            <label>UpHills</label>
            <input type="text" onChange={onUpHillsChange} value={nUpHills}/>
            <label>DownHills</label>
            <input type="text" onChange={onDownHillsChange} value={nDownHills}/>
            <button type="button" onClick={onGameStart} >StartRace</button>
            <button type="button" onClick={()=> {setActiveScreen(menu.startingMenu)}} >Back</button>
        </Fragment>
    )
};

export default StandardRaceMenu;