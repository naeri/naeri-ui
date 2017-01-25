import React from 'react';
import Spinner from 'react-spinkit';

import css from './style.css';

const SpinnerContainer = ({ align, style, innerStyle }) => {
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
            <Spinner spinnerName="cube-grid" noFadeIn style={innerStyle}/>
        </div>
    );
};

export default SpinnerContainer;