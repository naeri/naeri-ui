import React from 'react';
import moment from 'moment';

import Settings from 'settings';
import css from './style.css';

class CommentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };

        this.onExpand = this.onExpand.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object,
        userModule: React.PropTypes.object
    }

    async componentDidMount() {
        const { userModule } = this.context;

        this.setState({
            user: await userModule.getCurrentUser()
        });
    }

    onExpand() {
        this.props.onExpand(this.props.top);
    }

    render() {
        const { translation } = this.context;
        const { 
            show, 
            expand, 
            groupedComments: _groupedComments,
            onCommentGroupSelected
        } = this.props;
        const { user } = this.state;

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
                        {_groupedComments.count}
                    </span>
                </div>
            )
        }

        const groupedComments = _groupedComments.map((commentGroup, i) => {
            const comments = commentGroup.comments.slice(0, 3).map((comment) => {
                const buttons = (() => {
                    if (user && user.id === comment.author.id) {
                        return (
                            <div 
                                className={css.buttons}
                                onClick={(event) => event.stopPropagation()}>
                                <a 
                                    className={css.button}
                                    onClick={() => this.props.onCommentEditing(comment.range, comment.id, comment.content)}>
                                    {translation.edit}
                                </a>
                                <a 
                                    className={css.button}
                                    onClick={() => this.props.onCommentDeleting(comment.id)}>
                                    {translation.delete}
                                </a>
                            </div>
                        );
                    }
                })();

                return (
                    <div
                        className={css.comment}
                        key={comment.id}>
                        <div className={css.meta}>
                            <b className={css.author}>{comment.author.name}</b>
                            <span className={css.small}>
                                {moment(comment.createdAt).format(translation.timeFormat)}
                            </span>
                        </div>
                        <div className={css.content}>
                            {comment.content.slice(0, 50)}
                            {comment.content.length > 50 ? '...' : ''}
                        </div>
                        {buttons}
                    </div>
                );
            });

            return (
                <div 
                    className={css.commentGroup} 
                    key={i}
                    onClick={() => onCommentGroupSelected(commentGroup)}>
                    <div
                        className={css.commentContent}>
                        <span style={{ background: commentGroup.color }}>
                            {commentGroup.content}
                        </span>
                    </div>
                    <div className={css.comments}>
                        {comments}
                        {(() => {
                            if (commentGroup.comments.length > 3) {
                                return (
                                    <div className={css.more}>{translation.more}</div>
                                );
                            }
                        })()}
                    </div>
                </div>
            );
        });

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
                    {groupedComments}
                </div>
            </div>
        )
    }
}

export default CommentView;