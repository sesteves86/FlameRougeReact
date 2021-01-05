import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import PlayerOptions from "./PlayerOptions";
import './../Styles/Player.css';

const Player = ({player, rider1, rider2, makeDecision, activePlayer, activePrimaryRider, hasFinished}) => {
    const [options1, setOptions1] = useState([]);
    const [options2, setOptions2] = useState([]);
    
    const playerClass = "player player" + player.id + (hasFinished ? " hidden" : "");
    var playerTitle = player.human ? 
        "Human " +  player.id :
        "CPU " +  player.id ;

    useEffect( () => {
        rider1.shuffle();
        rider2.shuffle();
        setOptions1(rider1.getTop4Cards());
        setOptions2(rider2.getTop4Cards());
    }, []);

    const onClick = (key, value) => {
        makeDecision(key, value);
    }

    return (
        <div className={playerClass}>
            <p className="player-number">{ playerTitle }</p>
            <div>
            <h3>Sprinter</h3>
            
            { player.human === true && activePlayer === player.id && activePrimaryRider &&
                <PlayerOptions 
                    options = {options1}
                    onClick = { onClick }
                />
            }
            </div>
            <div>
                <h3>Rouler</h3>
                { player.human === true && activePlayer === player.id && !activePrimaryRider &&
                    <PlayerOptions 
                        options = {options2}
                        onClick = { onClick }
                    />
                }
            </div>
        </div>
    );
};

Player.propTypes = {
    player: PropTypes.shape(),
    rider1: PropTypes.shape(),
    rider2: PropTypes.shape(),
    makeDecision: PropTypes.func,
    activePlayer: PropTypes.number,
    activePrimaryRider: PropTypes.bool,
    hasFinished: PropTypes.bool,
}

export default Player;
