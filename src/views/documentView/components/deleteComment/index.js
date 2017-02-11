import React from 'react';

import css from './style.css';

class DeleteComment extends React.Component {
    constructor() {
        super();

        this.state = {
            deleting: false
        };

        this.onDelete = this.onDelete.bind(this);
    }

    static contextTypes = {
        documentModule: React.PropTypes.object,
        translation: React.PropTypes.object
    }

    async onDelete() {
        const { documentModule } = this.context;
        const { commentId, onDeleted } = this.props;

        this.setState({
            deleting: true
        });

        try {
            await documentModule.deleteComment(commentId);
            onDeleted();
        } catch (e) {
            this.setState({
                deleting: false
            });
        }
    }

    render() {
        const { onClose } = this.props;
        const { deleting } = this.state;
        const { translation } = this.context;

        return (
            <div className={css.wrap}>
                <div className={css.title}>
                    {translation.deleteComment}
                    <span 
                        className={css.close}
                        onClick={onClose}>
                        &times;
                    </span>
                </div>
                {translation.deleteCommentWarning}
                <button 
                    className={deleting ? css.submittingBtn : css.button}
                    onClick={this.onDelete}>
                    {translation.delete}
                </button>
            </div>
        );
    }
}

export default DeleteComment;