import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import Parser from 'koto-parser';

import Settings from 'settings';
import TagInput from './components/tagInput';
import ResizeAnimationButton from 'components/resizeAnimationButton';

import css from './style.css';

class DocumentWrite extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            text: '',
            parsedText: '',
            tags: [],
            suggestions: [],
            writeMode: true,
            submitting: false
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
        const { tagModule } = this.context;

        let suggestions = await tagModule.getTagList();

        this.setState({
            suggestions: suggestions
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
        const { title, text, tags } = this.state;

        this.setState({
            submitting: true
        });

        try {
            await documentModule.addDocument(title, text, tags);
            browserHistory.push('/');
        } catch (e) {
            this.setState({
                submitting: false
            });
        }
    }

    render() {
        const { translation } = this.props;

        return (
            <div className={css.wrap}>
                <input 
                    type="text"
                    className={css.title}
                    value={this.state.title}
                    onChange={(event) => this.setState({ title: event.target.value })}
                    placeholder={translation.whatTitle} />
                <div className={css.contentWrap}>
                    <textarea
                        className={css.editor}
                        value={this.state.text}
                        onChange={(event) => this.setState({ text: event.target.value })}
                        placeholder={translation.whatContent} />
                </div>
                <div className={css.tagWrap}>
                    <div className={css.tagInputWrap}>
                        <TagInput
                            tags={this.state.tags}
                            suggestions={this.state.suggestions}
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
                            submitting={this.state.submitting}
                            onClick={this.onFormSubmitted} /> 
                    </div>
                </div>
            </div>
        );
    }
}

export default DocumentWrite;