import React from 'react';

import css from './style.css';

const Spinner = ({ align, style, innerStyle, color }) => {
    let className = (() => {
        if (align == 'left') {
            return css.left;
        } else if (align == 'right') {
            return css.right;
        }

        return css.center;
    })();

    return (
        <div className={className} style={style}>
            <div className={css.chasingDots} style={innerStyle}>
                <div className={css.dot1} style={{ backgroundColor: color || '#333' }} />
                <div className={css.dot2} style={{ backgroundColor: color || '#333' }}/>
            </div>
        </div>
    );
};

export default Spinner;