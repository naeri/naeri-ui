import React from 'react';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import _ from 'utils';

import CommentInput from './components/commentInput';
import CommentView from './components/commentView';
import TagsList from './components/tagsList';
import Spinner from 'components/spinner';
import SelectionMenu from './components/selectionMenu';

import utils from 'utils';
import { 
    importSelection, 
    exportSelection,
    highlight
} from 'utils/selectionManager';

import css from './style.css';

const Button = ({ iconId, content, onClick }) => (
    <div 
        className={css.button}
        onClick={onClick}>
        <i className={`fa fa-${iconId} ${css.icon}`} />
        <span className={css.buttonText}>
            {content}
        </span>
    </div>
);

class DocumentView extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            document: undefined,
        };
    }

    async componentDidMount() {
        const documentId = this.props.params.documentId;

        try {
            let document = await this.context.documentModule.getDocument(documentId);

            this.setState({
                document: document
            });
        } catch (e) {
            this.setState({
                document: null
            });
        }
    }

    
    render() {
        const { document } = this.state;
        const { translation } = this.props;

        if (document === undefined) {
            return <Spinner />;
        }

        if (document === null) {
            return <div className={css.wrap}>{translation.cannotFind}</div>;
        }

        const tags = <TagsList tags={document.tags} />;

        return (
            <div className={css.wrap}>
                <div className={css.menus}>
                    <div className={css.left}>
                        <Button 
                            iconId="chevron-left" 
                            content={translation.toList} 
                            onClick={() => browserHistory.push(`/`)}/>
                    </div>
                    <div className={css.right}>
                        <Button 
                            iconId="pencil" 
                            content={translation.edit} 
                            onClick={() => browserHistory.push(`/edit/${document.id}`)} />
                        <Button 
                            iconId="history" 
                            content={translation.history}
                            onClick={() => browserHistory.push(`/history/${document.id}`)} />
                        {(() => {
                            if (!document.isArchived) {
                                return (
                                    <Button 
                                        iconId="trash" 
                                        content={translation.delete} 
                                        onClick={() => browserHistory.push(`/delete/${document.id}`)}/>
                                );
                            }
                        })()}
                        
                    </div>
                </div>
                <section className={css.documentWrap}>
                    <div className={css.grid}>
                        <div className={css.document}>
                            <div className={css.title}>
                                {document.title}
                            </div>
                            <div
                                className={css.content}
                                dangerouslySetInnerHTML={{ __html: document.parsedContent }} />
                        </div>
                        <div className={css.comments}>

                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

DocumentView.childContextTypes = {
    translation: React.PropTypes.object
}

DocumentView.contextTypes = {
    documentModule: React.PropTypes.object
};

export default DocumentView;