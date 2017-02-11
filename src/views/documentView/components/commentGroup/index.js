import React from 'react';

import css from './style.css';

class CommentGroup extends React.Component {
    constructor() {
        super();

        this.state = {
            content: '',
            submittingComment: false
        };

        this.onCommentAdding = this.onCommentAdding.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object,
        documentModule: React.PropTypes.object,
        documentId: React.PropTypes.string
    }

    async onCommentAdding() {
        const { documentId, documentModule } = this.context;
        const { content } = this.state;
        const { commentGroup, onCommentAdded } = this.props;

        this.setState({
            submittingComment: true
        });

        try {
            const { id } = await documentModule.addComment(documentId, content, commentGroup.range);

            onCommentAdded(id);
        } catch (e) {
            this.setState({
                submittingComment: false
            })
        }
    }

    render() {
        const { commentGroup, onClose } = this.props;
        const { content, submittingComment } = this.state;
        const { translation } = this.context;
        const { comments } = commentGroup;

        return (
            <div className={css.wrap}>
                <div className={css.title}>
                    {translation.commentGroup}
                    <span 
                        className={css.close}
                        onClick={onClose}>
                        &times;
                    </span>
                </div>
                <div className={css.label}>
                    {translation.documentContent}
                </div>
                <div>
                    <span 
                        className={css.commentSnippet}
                        style={{ background: commentGroup.color }}>
                        {commentGroup.content}
                    </span>
                </div>
                <div className={css.label}>
                    {translation.reply}
                </div>
                <textarea
                    className={css.textarea}
                    value={content}
                    onChange={(event) => this.setState({ content: event.target.value })}
                    placeholder={translation.whatOpinion} />
                <button 
                    className={submittingComment ? css.submittingBtn : css.button}
                    onClick={this.onCommentAdding}>
                    {translation.reply}
                </button>
                <div className={css.label}>
                    {translation.commentGroup}
                </div>
                <div className={css.comments}>
                    {comments.map((comment, i) => (
                        <div className={css.comment} key={i}>
                            <div className={css.meta}>
                                <b className={css.authorName}>{comment.author.name}</b>
                                <span className={css.small}>@{comment.author.id}</span>
                            </div>
                            <div className={css.content}>
                                {comment.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default CommentGroup;