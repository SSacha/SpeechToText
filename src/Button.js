
import React from 'react'
import PropTypes from 'prop-types'

import './Button.css'

const Button = ({ id, button, feedback }) => (
    <button id={`${id}`} name={`${button}`} className={`${feedback}` === 'default' ? `button ${button}` : `button ${feedback}`}>
    </button>
)

Button.propTypes = {
    button: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    feedback: PropTypes.oneOf([
        'green',
        'yellow',
        'red',
        'default',
    ]).isRequired,
}

export default Button