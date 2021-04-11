import React from 'react';
import PropTypes from 'prop-types';

const PlayerOptions = ({options, onClick, riderId}) => {
    return (
        <div className="player-option">
            {options.map( (option, index) => (
                <button
                    type = "button"
                    key = {index}
                    value = {option}
                    onClick = { () => onClick(riderId, option)}
                    >{option}</button>
            ))}
        </div>
    );
};

PlayerOptions.propTypes = {
    options: PropTypes.arrayOf(PropTypes.number),
    onClick: PropTypes.func.isRequired,
};

export default PlayerOptions;