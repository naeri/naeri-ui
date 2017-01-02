import React from 'react';

import css from './style.css';

class TagSelectorRowComponent extends React.Component {
    constructor(props) {
        super(props);

        this.clicked = this.clicked.bind(this);
    }
    
    clicked() {
        this.props.clicked(this.props.tag);
    }
    
    render() {
        let className = this.props.active ? css.activeRow : css.row;

        return (
            <li 
                className={className} 
                onClick={this.clicked} 
                style={{ color: this.props.tag.color }}>
                <span
                    style={{ backgroundColor: this.props.tag.color }}
                    className={css.square}></span>
                <span className={css.title}>
                    { this.props.tag.title }
                </span>
                <span className={css.count}>
                    { this.props.tag.count }
                </span>
            </li>
        )
    }
}

export default TagSelectorRowComponent;