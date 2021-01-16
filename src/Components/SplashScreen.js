import React, { useEffect } from "react";
import PropTypes from "prop-types";
import './../Styles/SplashScreen.css';

const SplashScreen = ({setActiveScreen, menu}) => {

    useEffect(() => {
        setTimeout(function() {
            setActiveScreen(menu.startingMenu);
        }, 3000);
    }, []);

    return (
        <div className="splashScreen__container">
            <div className="splashScreen__fader"></div>
            <h1 className="splashScreen__text">Welcome</h1>
        </div>
    )
};

SplashScreen.propTypes = {
    setActiveScreen: PropTypes.func,
    menu: PropTypes.shape(),
}

export default SplashScreen;