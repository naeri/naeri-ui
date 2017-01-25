import React from 'react';

import Settings from 'settings';
import css from './style.css';

class CommentInputComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            submitting: false,
            hidden: false
        }

        this.onCommentChanged = this.onCommentChanged.bind(this);
        this.onCommentAdded = this.onCommentAdded.bind(this);
    }

    onCommentChanged(event) {
        this.setState({
            comment: event.target.value
        });
    }

    onCommentAdded() {
        const documentModule = this.props.documentModule;
        const documentId = this.props.documentId;

        this.setState({
            submitting: true
        });

        documentModule
            .addComment(documentId, {
                comment: this.state.comment,
                selectionInfo: this.props.selectionInfo
            })
            .then(() => {
                this.setState({
                    submitting: false,
                    hidden: true
                });

                this.props.onCommentAdded();
            });
    }

    render() {
        if (this.state.hidden) {
            return null;
        }

        const buttonContent = (() => {
            if (this.state.submitting) {
                return '댓글 다는 중...';
            } else {
                return (
                    <span>
                        <i className="fa fa-comment"></i>
                        {' '}
                        댓글 달기
                    </span>
                );
            }
        })();

        return (
            <div 
                className={css.wrap}
                style={{ 
                    top: this.props.Y - 14
                }}>
                <header className={css.title}>
                    댓글 달기
                </header>
                <textarea
                    className={css.textarea}
                    value={this.state.comment} 
                    onChange={this.onCommentChanged}
                    placeholder="어떤 의견을 갖고 계신가요?" />
                <button
                    className={this.state.submitting ? css.submitting : css.button}
                    onClick={this.onCommentAdded}>
                    {buttonContent}
                </button>
            </div>
        );
    }
}

export default CommentInputComponent;