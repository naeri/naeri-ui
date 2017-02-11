import React from 'react';
import { browserHistory } from 'react-router';

import css from './style.css';

class DeleteDocument extends React.Component {
    constructor() {
        super();

        this.state = {
            deleting: false
        };
    }

    static contextTypes = {
        translation: React.PropTypes.object,
        documentModule: React.PropTypes.object
    }

    async onDelete(documentId) {
        const { documentModule } = this.context;

        this.setState({
            deleting: true
        });

        try {
            await documentModule.deleteDocument(documentId);
            browserHistory.push('/');
        } catch (e) {
            this.setState({
                deleting: false
            });
        }
    }

    render() {
        const { documentId, onClose } = this.props;
        const { deleting } = this.state;
        const { translation } = this.context;

        return (
            <div className={css.wrap}>
                <div className={css.title}>
                    {translation.deleteDocument}
                    <span 
                        className={css.close}
                        onClick={onClose}>
                        &times;
                    </span>
                </div>
                {translation.deleteDocumentWarning}
                <button 
                    className={deleting ? css.submittingBtn : css.button}
                    onClick={() => this.onDelete(documentId)}>
                    {translation.delete}
                </button>
            </div>
        );
    }
}

export default DeleteDocument;