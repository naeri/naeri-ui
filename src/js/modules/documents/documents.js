import React from 'react';
import axios from 'axios';
import Spinner from 'react-spinkit';

import TagSelector from '../../components/tag.selector/component';
import DocumentForm from '../../components/document.form/component';
import Document from '../../components/document.list.row/component';

import columns from '../../common/columns.css';
import commonCss from '../../common/common.css';
import css from './style.css';

class Documents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTag: null,
            lastDocumentId: null,
            documents: [],
            loadingDocuments: false,
            tags: [],
            loadingTags: false
        };

        this.onSelectedTagChanged = this.onSelectedTagChanged.bind(this);
        this.onDocumentSubmitted = this.onDocumentSubmitted.bind(this);
    }

    componentWillMount() {
        this.reloadTags();
        this.loadDocuments();
    }

    onSelectedTagChanged(tag) {
        let selectedTag = tag !== this.state.selectedTag ? tag : null;

        this.setState({
            selectedTag: selectedTag
        });

        let tagId = null;

        if (selectedTag) {
            tagId = selectedTag._id;
        }

        this.loadDocuments(tagId);
    }

    onDocumentSubmitted(title, markdown, tags) {
        let self = this;
        const documentModule = this.props.documentModule;

        return documentModule.addDocument(title, markdown, tags)
            .then(function(documents) {
                self.loadDocuments();
                self.reloadTags();
            });
    }

    loadDocuments(tag) {
        let self = this;
        const documentModule = this.props.documentModule;
        let id = null;

        if (tag) {
            id = tag._id;
        }

        this.setState({
            loadingDocuments: true
        });

        return documentModule.getDocuments(id)
            .then(function(documents) {
                self.setState({
                    documents: documents,
                    loadingDocuments: false
                });
            });
    }

    reloadTags() {
        let self = this;
        const tagModule = this.props.tagModule;

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
                    <div className={commonCss.spinnerWrap}>
                        <Spinner spinnerName="cube-grid" noFadeIn />
                    </div>
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
                    <div className={commonCss.spinnerWrap}>
                        <Spinner spinnerName="cube-grid" noFadeIn />
                    </div>
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
                        <DocumentForm 
                            tags={this.state.tags}
                            onDocumentSubmitted={this.onDocumentSubmitted}/>
                        {documents}
                    </div>
                </div>
            </div>
        );
    }
}

export default Documents;