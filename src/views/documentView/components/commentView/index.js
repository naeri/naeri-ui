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
            groupedComments: _groupedComments
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
                        {_groupedComments.length}
                    </span>
                </div>
            )
        }

        const groupedComments = _groupedComments.map((commentGroup, i) => {
            const comments = commentGroup.comments.map((comment) => {
                const buttons = (() => {
                    if (user && user.id === comment.author.id) {
                        return (
                            <div className={css.buttons}>
                                <a 
                                    className={css.button}
                                    onClick={() => this.props.onCommentEditing(comment.range, comment.id, comment.content)}>
                                    {translation.edit}
                                </a>
                                <a className={css.button}>
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
                                {moment(comment.createdAt).format(translation.updatedTimeFormat)}
                            </span>
                        </div>
                        <div className={css.content}>
                            {comment.content}
                        </div>
                        {buttons}
                    </div>
                );
            });

            return (
                <div 
                    className={css.commentGroup} 
                    key={i}>
                    <div
                        className={css.commentContent}>
                        <span style={{ background: commentGroup.color }}>
                            {commentGroup.content}
                        </span>
                    </div>
                    <div className={css.comments}>
                        {comments}
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