import React from 'react';
import { browserHistory } from 'react-router';

import css from './style.css';

class DeleteDocument extends React.Component {
    constructor() {
        super();

        this.state = {
            archiving: false
        };

        this.onDelete = this.onDelete.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object,
        documentModule: React.PropTypes.object
    }

    async onDelete() {
        const { documentId } = this.props;
        const { documentModule } = this.context;

        this.setState({
            archiving: true
        });

        try {
            await documentModule.archiveDocument(documentId);
            browserHistory.push('/');
        } catch (e) {
            this.setState({
                archiving: false
            });
        }
    }

    render() {
        const { onClose } = this.props;
        const { archiving } = this.state;
        const { translation } = this.context;

        return (
            <div className={css.wrap}>
                <div className={css.title}>
                    {translation.archiveDocument}
                    <span 
                        className={css.close}
                        onClick={onClose}>
                        &times;
                    </span>
                </div>
                {translation.archiveDocumentWarning}
                <button 
                    className={archiving ? css.submittingBtn : css.button}
                    onClick={this.onDelete}>
                    {translation.archive}
                </button>
            </div>
        );
    }
}

export default DeleteDocument;