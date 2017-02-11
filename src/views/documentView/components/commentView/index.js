import React from 'react';
import moment from 'moment';

import Settings from 'settings';
import css from './style.css';

class CommentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expand: false
        }

        this.onExpand = this.onExpand.bind(this);
        this.onHighlightComment = this.onHighlightComment.bind(this);
        this.onDehighlightComment = this.onDehighlightComment.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object
    }

    onExpand() {
        this.props.onExpand(this.props.top)
    }

    onHighlightComment(range, event) {
        this.props.onHighlightComment(range);
    }

    onDehighlightComment() {
        this.props.onDehighlightComment();
    }

    render() {
        const { translation } = this.context;
        const { show, expand, comments: _comments } = this.props;

        if (!show) {
            return null;
        }

        if (!expand) {
            return (
                <div
                    className={css.wrap}
                    style={{ top: Math.round(this.props.top) }}>
                    <span 
                        className={css.count}
                        onClick={this.onExpand}>
                        {this.props.comments.length}
                    </span>
                </div>
            )
        }

        const comments = _comments.map((comment) => (
            <div
                className={css.comment}
                key={comment.id}
                onMouseOver={() => this.onHighlightComment(comment.range)}
                onMouseLeave={this.onDehighlightComment}>
                <div className={css.meta}>
                    <b className={css.author}>{comment.author.name}</b>
                    <span className={css.small}>
                        {moment(comment.createdAt).format(translation.updatedTimeFormat)}
                    </span>
                </div>
                <div className={css.content}>
                    {comment.content}
                </div>
            </div>
        ));

        return (
            <div 
                className={css.modalWrap}
                style={{ top: Math.round(this.props.top) - 45 }}>
                <header className={css.title}>
                    {translation.commentList}
                    <a
                        className={css.close}
                        onClick={this.onExpand}>
                        &times;
                    </a>
                </header>
                <div className={css.comments}>
                    {comments}
                </div>
            </div>
        );
    }
}

export default CommentView;