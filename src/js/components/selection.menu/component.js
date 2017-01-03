import React from 'react';

import css from './style.css';

class SelectionMenuComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0
        };

        this.onCommentAdding = this.onCommentAdding.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.setState({
            width: width,
            height: height
        });
    }

    onCommentAdding(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onCommentAdding();
    }

    onMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onMenuSelected();
    }

    render() {
        const x = this.props.X;
        const y = this.props.Y;

        return (
            <div 
                className={css.wrap}
                style={{ 
                    top: y - this.state.height - 10,
                    left: x - this.state.width / 2 
                }}
                ref={(container) => { this.container = container; }}
                onMouseUp={this.onMouseUp}>
                <a onMouseDown={this.onCommentAdding}>
                    <i className="fa fa-comment"></i>
                    {' '}
                    댓글 달기
                </a>
            </div>
        );
    }
}

export default SelectionMenuComponent;