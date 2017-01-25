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

    componentWillMount() {
        this.reloadTags();
        this.loadDocuments();
        this.context.userModule.getCurrentUser()
            .then((user) => {
                this.setState({
                    user: user
                });
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

    onDocumentSubmitted(title, markdown, tags) {
        let self = this;
        const documentModule = this.context.documentModule;

        return documentModule.addDocument(title, markdown, tags)
            .then(function(documents) {
                self.setState({
                    selectedTag: null,
                    lastDocumentId: null
                });

                self.loadDocuments();
                self.reloadTags();
            });
    }

    loadDocuments() {
        let self = this;
        const documentModule = this.context.documentModule;

        this.setState({
            loadingDocuments: true
        });

        let id = (() => {
            const selectedTag = this.state.selectedTag;

            if (selectedTag) {
                return selectedTag._id;
            } else {
                return null;
            }
        })();

        return documentModule.getDocuments(id, this.state.lastDocumentId)
            .then(function(documents) {
                self.setState({
                    documents: documents,
                    loadingDocuments: false
                });
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
                            key={document._id}/>
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

DocumentList.contextTypes = {
    tagModule: React.PropTypes.object,
    userModule: React.PropTypes.object,
    documentModule: React.PropTypes.object
}

export default DocumentList;