import React from 'react';

import css from './style.css';

class SelectionMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0
        };

        this.onCommentAdding = this.onCommentAdding.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object
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
        this.props.onCommentAdding();

        event.preventDefault();
        event.stopPropagation();
    }

    onMouseUp(event) {
        this.props.onMouseUp();

        event.preventDefault();
        event.stopPropagation();
    }

    render() {
        const { translation } = this.context;
        const { X, Y } = this.props;

        return (
            <div 
                className={css.wrap}
                style={{ 
                    top: Y - this.state.height - 10,
                    left: X - this.state.width / 2 
                }}
                ref={(container) => { this.container = container; }}
                onMouseUp={this.onMouseUp}>
                <a onMouseDown={this.onCommentAdding}>
                    <i className="fa fa-comment"></i>
                    {' '}
                    {translation.reply}
                </a>
            </div>
        );
    }
}

export default SelectionMenu;