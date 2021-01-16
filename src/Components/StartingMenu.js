import React from 'react';
import PropTypes from 'prop-types';

const StartingMenu = ({menu, setActiveScreen}) => {
    
    return (
        <div>
            <button onClick={() => {
                setActiveScreen(menu.game)
            }}>Start Game</button>
            <button onClick={() => {
                setActiveScreen(menu.rules)
            }}>Rules</button>
        </div>
    );
};

StartingMenu.propTypes = {
    setActiveScreen: PropTypes.func.isRequired,
    menu: PropTypes.shape()
};

export default StartingMenu;