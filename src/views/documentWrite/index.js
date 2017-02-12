import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import Parser from 'koto-parser';

import Settings from 'settings';
import TagInput from './components/tagInput';
import ResizeAnimationButton from 'components/resizeAnimationButton';
import Editor from './components/editor';
import Spinner from 'components/spinner';

import css from './style.css';

class DocumentWrite extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            parsedContent: '',
            tags: [],
            historyId: null,
            suggestions: [],
            documentId: props.params.documentId,
            writeMode: true,
            submitting: false,
            loadedDocument: false
        };

        this.onTagAdded = this.onTagAdded.bind(this);
        this.onTagRemoved = this.onTagRemoved.bind(this);
        this.onTagUpdated = this.onTagUpdated.bind(this);
        this.onFormSubmitted = this.onFormSubmitted.bind(this);
    }

    static contextTypes = {
        tagModule: React.PropTypes.object,
        documentModule: React.PropTypes.object,
    }

    static childContextTypes = {
        translation: React.PropTypes.object
    }

    getChildContext() {
        return {
            translation: this.props.translation
        };
    }

    async componentDidMount() {
        const { documentModule, tagModule } = this.context;
        const { documentId } = this.props.params;

        let [document, suggestions] = await Promise.all([
            documentModule.getDocument(documentId),
            tagModule.getTagList()
        ]);

        this.setState({
            title: document.title || '',
            content: document.content || '',
            tags: document.tags || [],
            historyId: document.historyId,
            suggestions: suggestions,
            loadedDocument: true
        });
    }

    onTagAdded(newTagTitle) {
        if (newTagTitle.trim() === '') {
            return;
        }

        const { tags, suggestions } = this.state;
        let i;
        
        for (i = 0; i < tags.length; i++) {
            const tag = tags[i];
            if (tag.title === newTagTitle) {
                break;
            }
        }

        if (i !== tags.length) {
            tags.push(tags.splice(i, 1)[0]);
        } else {
            const tag = suggestions.find((tag) => tag.title === newTagTitle);

            if (tag) {
                tags.push(tag);
            } else {
                tags.push({
                    title: newTagTitle,
                    color: Settings.colors[Math.floor(Math.random() * Settings.colors.length)]
                });
            }
        }

        this.setState({ 
            tags: tags
        });
    }

    onTagUpdated(oldTag, newTagTitle, newTagColor) {
        let { tags } = this.state;

        tags = tags.map((tag) => {
            if (tag.title === oldTag.title) {
                return {
                    title: newTagTitle,
                    color: newTagColor
                };
            } else {
                return tag;
            }
        });

        this.setState({
            tags: tags
        });
    }

    onTagRemoved(removedTag) {
        let { tags } = this.state;

        tags = tags.filter((tag) => {
            return tag.title !== removedTag.title
        });

        this.setState({
            tags: tags
        });
    }

    async onFormSubmitted(event) {
        if (this.state.submitting) {
            return;
        }

        const { documentModule } = this.context;
        const { title, content, tags, documentId, historyId } = this.state;

        this.setState({
            submitting: true
        });

        try {
            let id;

            if (!documentId) {
                id = await documentModule.addDocument(title, content, tags);
            } else {
                id = await documentModule.editDocument(documentId, historyId, title, content, tags);
            }

            browserHistory.push(`/view/${id}`);
        } catch (e) {
            this.setState({
                submitting: false
            });
        }
    }

    render() {
        const { translation } = this.props;
        const { 
            documentId, 
            title,
            content, 
            tags, 
            suggestions,
            submitting,
            loadedDocument
        } = this.state

        if (documentId && !loadedDocument) {
            return <Spinner style={{ height: 50 }} />;
        }

        return (
            <div className={css.wrap}>
                <input 
                    type="text"
                    className={css.title}
                    value={title}
                    onChange={(event) => this.setState({ title: event.target.value })}
                    placeholder={translation.whatTitle} />
                <div className={css.contentWrap}>
                    <Editor
                        value={content}
                        onChange={(event) => this.setState({ content: event.target.value })} />
                </div>
                <div className={css.tagWrap}>
                    <div className={css.tagInputWrap}>
                        <TagInput
                            tags={tags}
                            suggestions={suggestions}
                            onTagAdded={this.onTagAdded}
                            onTagUpdated={this.onTagUpdated}
                            onTagRemoved={this.onTagRemoved} />
                    </div>
                    <div className={css.tagButtonWrap}>
                       <ResizeAnimationButton
                            className={css.submitBtn}
                            submittingClassName={css.submittingBtn}
                            content={translation.publish}
                            submittingContent={translation.publishing}
                            submitting={submitting}
                            onClick={this.onFormSubmitted} /> 
                    </div>
                </div>
            </div>
        );
    }
}

export default DocumentWrite;