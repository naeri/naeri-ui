import React from 'react';

import Settings from 'settings';
import css from './style.css';

class CommentForm extends React.Component {
    constructor(props) {
        super(props);

        const { commentInfo } = props;

        this.state = {
            comment: commentInfo ? commentInfo.content : '',
            submitting: false
        }

        this.onCommentChanged = this.onCommentChanged.bind(this);
        this.onCommentAdded = this.onCommentAdded.bind(this);
    }

    static contextTypes = {
        documentModule: React.PropTypes.object,
        translation: React.PropTypes.object
    }

    onCommentChanged(event) {
        this.setState({
            comment: event.target.value
        });
    }

    async onCommentAdded() {
        const { documentId, selectionInfo, commentInfo } = this.props;
        const { comment } = this.state;
        const { documentModule } = this.context;

        this.setState({
            submitting: true
        });

        if (!commentInfo.id) {
            await documentModule.addComment(documentId, comment, selectionInfo);
        } else {
            await documentModule.editComment(commentInfo.id, comment);
        }

        this.setState({
            submitting: false
        });

        this.props.onCommentUpdated(commentInfo.id);
    }

    render() {
        const { translation } = this.context;
        const { commentInfo } = this.props;

        const buttonContent = (() => {
            if (this.state.submitting) {
                return translation.replying;
            } else {
                return (
                    <span>
                        <i className="fa fa-comment"></i>
                        {' '}
                        {commentInfo.id ? translation.edit : translation.reply}
                    </span>
                );
            }
        })();

        return (
            <div 
                className={css.wrap}
                style={{ 
                    top: this.props.Y - 45
                }}>
                <header className={css.title}>
                    {translation.reply}
                </header>
                <textarea
                    className={css.textarea}
                    value={this.state.comment}
                    onChange={this.onCommentChanged}
                    placeholder={translation.whatOpinion} />
                <button
                    className={this.state.submitting ? css.submitting : css.button}
                    onClick={this.onCommentAdded}>
                    {buttonContent}
                </button>
            </div>
        );
    }
}

export default CommentForm;