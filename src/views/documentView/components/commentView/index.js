import React from 'react';
import clickOutside from 'react-click-outside';
import moment from 'moment';

import Settings from 'settings';
import css from './style.css';

class CommentViewComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expand: this.props.expand
        }

        this.toggleExpand = this.toggleExpand.bind(this);
        this.onHighlightComment = this.onHighlightComment.bind(this);
        this.onClearHighlight = this.onClearHighlight.bind(this);
    }

    toggleExpand() {
        this.setState({
            expand: !this.state.expand
        });
    }

    onHighlightComment(range, event) {
        this.props.onHighlightComment(range);
    }

    onClearHighlight() {
        this.props.onClearHighlight();
    }

    handleClickOutside() {
        this.setState({
            expand: false
        });
    }

    render() {
        const { translation } = this.context;

        const content = (() => {
            if (this.state.expand) {
                const comments = this.props.comments.map((comment) => {
                    return (
                        <div
                            className={css.comment}
                            key={comment._id}
                            onMouseEnter={this.onHighlightComment.bind(this, comment.range)}
                            onMouseLeave={this.onClearHighlight}>
                            <div className={css.author}>
                                <b>{comment.author.username}</b>
                                {' '}
                                {moment(comment.createdAt).format(translation.updatedTimeFormat)}
                            </div>
                            {comment.content}
                        </div>
                    );
                });

                return (
                    <div>
                        <header className={css.title}>
                            {translation.commentList}
                            <a
                                className={css.close}
                                onClick={this.toggleExpand}>
                                &times;
                            </a>
                        </header>
                        {comments}
                    </div>
                )
            } else {
                return (
                    <span 
                        className={css.count}
                        onClick={this.toggleExpand}>
                        <i className="fa fa-comments" />
                        {' '}
                        {this.props.comments.length}
                    </span>
                );
            }
        })();

        return (
            <div 
                className={this.state.expand ? css.modalWrap : css.wrap}
                style={{ 
                    top: Math.round(this.props.top) - 2,
                    zIndex: this.state.expand ? 9999 : 1
                }}>
                {content}
            </div>
        );
    }
}

export default clickOutside(CommentViewComponent);