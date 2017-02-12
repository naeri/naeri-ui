import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import TagSelector from 'components/tagSelector';
import Document from './components/document';
import Spinner from 'components/spinner';

import css from './style.css';

class DocumentList extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedTag: null,
            lastDocumentId: null,
            documents: [],
            loadingDocuments: false,
            tags: [],
            loadingTags: false,
            user: null
        };

        this.onSelectedTagChanged = this.onSelectedTagChanged.bind(this);
    }

    async componentWillMount() {
        this.reloadTags();
        this.loadDocuments();
        
        let user = await this.context.userModule.getCurrentUser()
        this.setState({
            user: user
        });
    }

    onSelectedTagChanged(tag) {
        let selectedTag = tag !== this.state.selectedTag ? tag : null;

        this.setState({
            selectedTag: selectedTag,
            lastDocumentId: null
        }, () => {
            this.loadDocuments();
        });
    }

    async loadDocuments() {
        let self = this;
        const documentModule = this.context.documentModule;

        this.setState({
            loadingDocuments: true
        });

        let id = (() => {
            const selectedTag = this.state.selectedTag;

            if (selectedTag) {
                return selectedTag.id;
            } else {
                return null;
            }
        })();

        let documents = await documentModule.getDocuments(id, this.state.lastDocumentId);

        this.setState({
            documents: documents,
            loadingDocuments: false
        });
    }

    async reloadTags() {
        let self = this;
        const tagModule = this.context.tagModule;

        this.setState({
            loadingTags: true
        });

        const tags = await tagModule.getTagList();
        
        self.setState({
            tags: tags,
            loadingTags: false
        });
    }

    render() {
        const { translation } = this.props;

        let tags = (() => {
            if (this.state.loadingTags) {
                return (
                    <Spinner style={{ margin: '10px 0' }} />
                );
            } else {
                return (
                    <TagSelector
                        tags={this.state.tags}
                        selectedTag={this.state.selectedTag}
                        selectedTagChanged={this.onSelectedTagChanged} />
                );
            }
        })();

        let documents = (() => {
            if (this.state.loadingDocuments) {
                return (
                    <Spinner style={{ margin: '10px 0' }} />
                );
            } else {
                return this.state.documents.map((document) => {
                    return (
                        <Document 
                            document={document} 
                            key={document.id}/>
                    );
                });
            }
        })();

        return (
            <div className={css.wrap}>
                <div className={css.left}>
                    <div className={css.title}>
                        <span className={css.titleText}>
                            {translation.tags}
                        </span>
                        <span className={css.buttons}>
                            <button
                                className={css.button}>
                                <i className="fa fa-cog" />
                            </button>
                        </span>
                    </div>
                    {tags}
                </div>
                <div className={css.right}>
                    <div className={css.title}>
                        <span className={css.titleText}>
                            {translation.documents}
                        </span>
                        <span className={css.buttons}>
                            <Link to="/write">
                                <button
                                    className={css.button}>
                                    <i className="fa fa-pencil" />
                                </button>
                            </Link>
                        </span>
                    </div>
                    <div className={css.documents}>
                        {documents}
                    </div>
                </div>

            </div>
        );
    }
}

DocumentList.childContextTypes = {
    translation: React.PropTypes.object
}

DocumentList.contextTypes = {
    tagModule: React.PropTypes.object,
    userModule: React.PropTypes.object,
    documentModule: React.PropTypes.object
}

export default DocumentList;