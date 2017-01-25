import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import TagSelector from './components/tagSelector';
import Form from './components/form';
import Document from './components/document';
import Spinner from 'components/spinner';

import columns from 'common/columns.css';
import commonCss from 'common/common.css';
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
        this.onDocumentSubmitted = this.onDocumentSubmitted.bind(this);
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

    async onDocumentSubmitted(title, markdown, tags) {
        const documentModule = this.context.documentModule;

        await documentModule.addDocument(title, markdown, tags)
         
        this.setState({
            selectedTag: null,
            lastDocumentId: null
        }, () => {
            this.loadDocuments();
            this.reloadTags();
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

    reloadTags() {
        let self = this;
        const tagModule = this.context.tagModule;

        this.setState({
            loadingTags: true
        });

        return tagModule.getTagList()
            .then(function(tags) {
                self.setState({
                    tags: tags,
                    loadingTags: false
                });
            });
    }

    render() {
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
            <div className={commonCss.wrap}>
                <div className={columns.col3 + ' ' + columns.left}>
                    {tags}
                </div>
                <div className={columns.col9 + ' ' + columns.right}>
                    <div className={css.documents}>
                        <Form
                            tags={this.state.tags}
                            user={this.state.user}
                            onDocumentSubmitted={this.onDocumentSubmitted}/>
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