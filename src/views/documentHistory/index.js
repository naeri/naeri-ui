import React from 'react';
import { browserHistory } from 'react-router';

import css from './style.css';

import Spinner from 'components/spinner';
import Button from 'components/topMenuButton';
import UserEditInfo from 'components/userEditInfo';

class DocumentHistory extends React.Component {
    static contextTypes = {
        documentModule: React.PropTypes.object
    }
    
    static childContextTypes = {
        translation: React.PropTypes.object
    }

    constructor() {
        super();

        this.state = {
            history: undefined,
            expanded: false
        }
    }

    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    async componentDidMount() {
        const { documentModule } = this.context;
        const { documentId } = this.props.params;

        this.setState({
            history: undefined
        });

        try {
            const history = await documentModule.getHistory(documentId);

            this.setState({
                history: history
            });
        } catch (e) {
            this.setState({
                history: null
            });
        }
    }

    render() {
        const { documentId } = this.props.params;
        const { translation } = this.props;
        const { history, expanded } = this.state;

        if (history === undefined) {
            return <Spinner />;
        }

        if (history === null) {
            return <div className={css.wrap}>{translation.cannotFind}</div>;
        }

        return (
            <div className={css.wrap}>
                <div className={css.menus}>
                    <div className={css.left}>
                        <Button 
                            iconId="angle-left" 
                            content={translation.toDocument} 
                            onClick={() => browserHistory.push(`/view/${documentId}`)}/>
                    </div>
                    <div className={css.right}>
                        <Button 
                            iconId="angle-double-right" 
                            content={translation.latestDocument} 
                            onClick={() => browserHistory.push(`/view/${history[0].id}`)} />
                    </div>
                </div>
                <div className={css.history}>
                    <h1 className={css.header}>{translation.documentHistory}</h1>
                    <ul 
                        className={css.documents}>
                        {history.map((document, i) => (
                            <li 
                                className={css.document}
                                key={i}>
                                <div className={expanded ? css.expandedLeft : css.documentLeft}>
                                    <div className={css.buttons}>
                                        <button className={css.button}>
                                            {translation.compareDiff}
                                        </button>
                                        <button 
                                            className={css.button}
                                            onClick={() => browserHistory.push(`/view/${document.id}/`)}>
                                            {translation.view}
                                        </button>
                                    </div>
                                </div>
                                <div 
                                    className={css.documentRight}
                                    onClick={() => this.setState({ expanded: !expanded })}>
                                    <div className={document.revision === history.length ? css.latest : css.revision}>
                                        {document.revision}
                                    </div>
                                    <div className={css.documentInfo}>
                                        <div className={css.userEditInfo}>
                                            <UserEditInfo 
                                                id={document.author.id}
                                                name={document.author.name}
                                                updated={document.createdAt} />
                                        </div>
                                        <div className={css.documentContent}>
                                            <div className={css.title}>
                                                {document.title}
                                            </div>
                                            <div className={css.content}>
                                                {document.content.slice(0, 30)}
                                                {' '}
                                                {document.content.length > 30 ? '...' : ''}
                                            </div>
                                        </div>
                                        <div className={css.tags}>
                                            {document.tags.map((tag, i) => (
                                                <span 
                                                    className={css.tag}
                                                    style={{ background: tag.color }}
                                                    key={i}>
                                                    {tag.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        
                    </ul>
                </div>
            </div>
        );
    }
}

export default DocumentHistory;