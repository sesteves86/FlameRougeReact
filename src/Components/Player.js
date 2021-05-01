import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import PlayerOptions from "./PlayerOptions";
import './../Styles/Player.css';
import arrayOrdering from "../Utilities/ArrayOrdering";

const Player = ({player, isHuman, riders, makeHumanDecision, activePlayer, activeRider, hasFinished}) => {
    const [cardOptions, setCardOptions] = useState([]);
    
    const playerClass = "player player" + player + (hasFinished ? " hidden" : "");
    const playerTitle = isHuman ? 
        "Human " +  player :
        "CPU " +  player ;

    useEffect( () => {
        let newCardOptions = [];
        riders.forEach(r => {
            const deepCopyDeck = JSON.parse(JSON.stringify(r.cards));
            const shuffledDeck = arrayOrdering.shuffleArray(deepCopyDeck);
            const top4Cards = shuffledDeck.slice(0,4);
            newCardOptions.push(top4Cards);
        })
        setCardOptions(newCardOptions);
    }, [riders]);

    const onClick = (key, value) => {
        makeHumanDecision(key, value);
    }

    return (
        <div className={playerClass}>
            <p className="player-number">{ playerTitle }</p>
                { riders.map((rider, index) => (
                    <div>
                        <h3>{rider.name}</h3>
                        { isHuman && rider.id === activeRider && cardOptions[index] && cardOptions[index].length > 0 &&
                            <PlayerOptions 
                                options = {cardOptions[index]}
                                onClick = { onClick }
                                riderId = {rider.id}
                            />
                        }
                    </div>
                ))}
        </div>
    );
};

Player.propTypes = {
    player: PropTypes.number,
    isHuman: PropTypes.bool,
    riders: PropTypes.shape(),
    makeHumanDecision: PropTypes.func,
    activePlayer: PropTypes.number,
    activeRider: PropTypes.number,
    hasFinished: PropTypes.bool,
}

export default Player;
