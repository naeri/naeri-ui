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

        this.toggleExpand = this.toggleExpand.bind(this);
        this.onHighlightComment = this.onHighlightComment.bind(this);
        this.onDehighlightComment = this.onDehighlightComment.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object
    }

    toggleExpand() {
        this.setState({
            expand: !this.state.expand
        });
    }

    onHighlightComment(range, event) {
        this.props.onHighlightComment(range);
    }

    onDehighlightComment() {
        this.props.onDehighlightComment();
    }

    render() {
        const { translation } = this.context;

        if (!this.props.show) {
            return null;
        }

        if (!this.state.expand) {
            return (
                <div
                    className={css.wrap}
                    style={{ top: Math.round(this.props.top) - 5 }}>
                    <span 
                        className={css.count}
                        onClick={this.toggleExpand}>
                        {this.props.comments.length}
                    </span>
                </div>
            )
        }

        const comments = this.props.comments.map((comment) => (
            <div
                className={css.comment}
                key={comment.id}
                onMouseOver={() => this.onHighlightComment(comment.range)}
                onMouseLeave={this.onDehighlightComment}>
                <div className={css.author}>
                    <b>{comment.author.name}</b>
                    <span className={css.small}>
                        {moment(comment.createdAt).format(translation.updatedTimeFormat)}
                    </span>
                </div>
                {comment.content}
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
                        onClick={this.toggleExpand}>
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