import React from 'react';

import css from './style.css';

const Button = ({ iconId, content, onClick }) => (
    <div 
        className={css.button}
        onClick={onClick}>
        <i className={`fa fa-${iconId} ${css.icon}`} />
        <span className={css.buttonText}>
            {content}
        </span>
    </div>
);

export default Button;