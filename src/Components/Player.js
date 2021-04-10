import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import PlayerOptions from "./PlayerOptions";
import './../Styles/Player.css';

const Player = ({player, isHuman, riders, makeDecision, activePlayer, activeRider, hasFinished}) => {
    const [cardOptions, setCardOptions] = useState([]);
    
    const playerClass = "player player" + player + (hasFinished ? " hidden" : "");
    const playerTitle = isHuman ? 
        "Human " +  player :
        "CPU " +  player ;

    useEffect( () => {
        let newCardOptions = [];
        riders.forEach(r => {
            r.shuffle();
            newCardOptions.push(r.getTop4Cards());
        })
        setCardOptions(newCardOptions);
    }, [riders]);

    const onClick = (key, value) => {
        makeDecision(key, value);
    }

    return (
        <div className={playerClass}>
            <p className="player-number">{ playerTitle }</p>
                { riders.map(rider => (
                    <div>
                        <h3>{rider.name}</h3>
                        { player.human && activePlayer === player.id && rider.id === activeRider &&
                            <PlayerOptions 
                                options = {cardOptions[0]}
                                onClick = { onClick }
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
    makeDecision: PropTypes.func,
    activePlayer: PropTypes.number,
    activeRider: PropTypes.number,
    hasFinished: PropTypes.bool,
}

export default Player;
