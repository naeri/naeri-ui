import React from 'react';
import axios from 'axios';
import marked from 'marked';

import Settings from 'settings';
import TagInput from '../tagInput';

import css from './style.css';

class DocumentFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            text: '',
            writeMode: true,
            tags: [],
            fullScreen: false,
            submitting: false,
            timestamp: +new Date()
        }

        this.onFormSubmitted = this.onFormSubmitted.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onWriteModeChanged = this.onWriteModeChanged.bind(this);
        this.onPreviewModeChanged = this.onPreviewModeChanged.bind(this);
        this.onTagAdded = this.onTagAdded.bind(this);
        this.onTagUpdated = this.onTagUpdated.bind(this);
        this.onTagRemoved = this.onTagRemoved.bind(this);
        this.onScreenToggle = this.onScreenToggle.bind(this);
    }

    onFormSubmitted(event) {
        if (this.setState.submitting) {
            return;
        }

        this.setState({
            submitting: true
        });

        let self = this;

        this.props.onDocumentSubmitted(this.state.title, this.state.text, this.state.tags)
            .then(function(response) {
                self.setState({
                    title: '',
                    text: '',
                    writeMode: true,
                    tags: [],
                    fullScreen: false,
                    submitting: false,
                    timestamp: +new Date()
                });
                this.form.reset();
            }).catch(function(error) {
                self.setState({
                    submitting: false
                });
            });
    }

    onTitleChanged(event) {
        this.setState({
            title: event.target.value
        });
    }

    onTextChanged(event) {
        this.setState({
            text: event.target.value
        });
    }

    onWriteModeChanged() {
        this.setState({
            writeMode: true
        });
    }

    onPreviewModeChanged() {
        this.setState({
            writeMode: false
        });
    }

    onTagAdded(newTagTitle) {
        const tags = this.state.tags;
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
            const tag = this.props.tags.find((tag) => tag.title === newTagTitle);

            if (tag) {
                tags.push(tag);
            } else {
                tags.push({
                    title: newTagTitle,
                    color: Settings.colors[Math.floor(Math.random() * Settings.colors.length)]
                });
            }
        }

        this.setState({ tags: tags });
    }

    onTagUpdated(oldTag, newTagTitle, newTagColor) {
        let tags = this.state.tags;

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
        let tags = this.state.tags;
        tags = tags.filter((tag) => {
            return tag.title !== removedTag.title
        });
        this.setState({
            tags: tags
        })
    }

    onScreenToggle(event) {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }

    render() {
        let displayPage = null;

        if (this.state.writeMode) {
            displayPage = (
                <div className={css.inputs}>
                    <input 
                        className={css.titleInput}
                        type="text"
                        value={this.state.title}
                        onChange={this.onTitleChanged}
                        placeholder="어떤 제목으로 글을 올릴까요?" 
                        autoFocus/>
                    <hr className={css.hr} />
                    <textarea 
                        className={css.textarea}
                        name="document"
                        value={this.state.text}
                        onChange={this.onTextChanged}
                        placeholder="어떤 말을 하시고 싶으신가요?" />
                </div>
            );
        } else {
            displayPage = (
                <div className={css.preview}>
                    <div className={css.titlePreview}>
                        { this.state.title ? this.state.title : '제목 없음' }
                    </div>
                    <hr className={css.hr}/>
                    <div
                        className={css.contentPreview}
                        dangerouslySetInnerHTML={{ __html: marked(this.state.text ? this.state.text : '내용을 작성해 주세요.') }}>
                    </div>
                </div>
            );
        }

        let profileImage = (() => {
            if (this.props.user) {
                return (
                    <img 
                        src={`${Settings.host}/user/picture/${this.props.user._id}`}
                        className={css.image} />
                );
            } else {
                return null;
            }
        })();

        return (
            <div
                className={this.state.fullScreen ? css.fullScreenForm : css.form}
                ref={(form) => { this.form = form }}>
                <div className={css.wrap}>
                    <nav className={css.tabs}>
                        <button 
                            type="button"
                            className={ this.state.writeMode ? css.tabBtnActive : css.tabBtn}
                            onClick={this.onWriteModeChanged}>
                            쓰기
                        </button>
                        <button 
                            type="button"
                            className={ this.state.writeMode ? css.tabBtn : css.tabBtnActive}
                            onClick={this.onPreviewModeChanged}>
                            보기
                        </button>
                        <nav className={css.secondaryBtns}>
                            <i
                                className={ this.state.fullScreen ? 'fa fa-compress' : 'fa fa-expand' }
                                onClick={this.onScreenToggle} />
                        </nav>
                    </nav>
                    <div className={css.write}>
                        <div className={css.profileImage}>
                            {profileImage}
                        </div>
                        {displayPage}
                    </div>
                    <div className={css.bottom}>
                        <TagInput
                            tags={this.state.tags}
                            suggestions={this.props.tags}
                            onTagAdded={this.onTagAdded}
                            onTagUpdated={this.onTagUpdated}
                            onTagRemoved={this.onTagRemoved}
                            key={this.state.timestamp}
                            />
                        <input
                            className={ this.state.submitting ? css.submittingBtn : css.submitBtn } 
                            type="submit"
                            value={ this.state.submitting ? '게시 중..' : '게시' } 
                            onClick={this.onFormSubmitted}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default DocumentFormComponent;