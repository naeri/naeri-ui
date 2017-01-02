import React from 'react';
import Spinner from 'react-spinkit';

import css from './style.css';

class SpinnerComponent extends React.Component {
    render() {
        let className = (() => {
            let align = this.props.align;

            if (align == 'left') {
                return css.left;
            } else if (align == 'right') {
                return css.right;
            }

            return css.center;
        })();

        return (
            <div className={className} style={this.props.style}>
                <Spinner spinnerName="cube-grid" noFadeIn style={this.props.innerStyle}/>
            </div>
        );
    }
}

export default SpinnerComponent;