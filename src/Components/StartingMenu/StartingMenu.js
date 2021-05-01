import React from 'react';
import PropTypes from 'prop-types';
import "../../Styles/StartingMenu.css";

const StartingMenu = ({menu, setActiveScreen}) => {
    
    return (
        <div className="startingMenu__container">
            <div className="startingMenu__button-container">
                <button className="startingMenu__button" onClick={() => {
                    setActiveScreen(menu.game)
                }}>Quick Race</button>
            </div>
            <div className="startingMenu__button-container">
                <button className="startingMenu__button" onClick={() => {
                    setActiveScreen(menu.standardRaceMenu)
                }}>Custom Race</button>
            </div>
            <div className="startingMenu__button-container">
                <button className="startingMenu__button" onClick={() => {
                    setActiveScreen(menu.rules)
                }}>Rules</button>
            </div>
        </div>
    );
};

StartingMenu.propTypes = {
    setActiveScreen: PropTypes.func.isRequired,
    menu: PropTypes.shape()
};

export default StartingMenu;