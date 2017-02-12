import React from 'react';
import { browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';

import TagInput from './components/tagInput';
import ResizeButton from 'components/resizeAnimationButton';

import Settings from 'settings';
import css from './style.css';

class UploadFile extends React.Component {
    static contextTypes = {
        translation: React.PropTypes.object,
        fileModule: React.PropTypes.object
    }

    constructor() {
        super();

        this.state = {
            file: null,
            filename: '',
            content: '',
            tags: [],
            uploading: false
        }

        this.onDrop = this.onDrop.bind(this);
        this.onTagAdded = this.onTagAdded.bind(this);
        this.onTagUpdated = this.onTagUpdated.bind(this);
        this.onTagRemoved = this.onTagRemoved.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }

    onDrop(files) {
        const file = files[0];
        
        this.setState({
            file: file,
            filename: file.name,
            content: '',
            tags: []
        }, () => {
            this.filenameInput.focus();
        });
    }

    onTagAdded(newTagTitle) {
        if (newTagTitle.trim() === '') {
            return;
        }

        const { tags } = this.state;
        const { tagSuggestions } = this.props;
        
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
            const tag = tagSuggestions.find((tag) => tag.title === newTagTitle);
1
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

    async onUpload() {
        const { fileModule } = this.context;
        const {
            filename,
            content,
            tags,
            file
        } = this.state;

        try {
            this.setState({
                uploading: true
            });

            const { id } = await fileModule.addFile(filename, content, tags, file);
            browserHistory.push(`/file/${id}`);
        } catch (e) {
            this.setState({
                uploading: false
            });
        }
    }

    render() {
        const { 
            tagSuggestions,
            onClose
        } = this.props;
        const { 
            file, 
            filename, 
            tags, 
            uploading,
            content
        } = this.state;
        const { translation } = this.context;

        const dropzoneContent = (({ isDragActive }) => {
            if (isDragActive && !file) {
                return (
                    <div className={css.dropzoneActiveWrap}>
                        <i className={`fa fa-upload ${css.icon}`} />
                        <div className={css.dropzoneText}>
                            {translation.uploadFile}
                        </div>
                    </div>  
                );
            } else if (isDragActive && file) {
                return (
                    <div className={css.dropzoneActiveWrap}>
                        <i className={`fa fa-upload ${css.icon}`} />
                        <div className={css.dropzoneText}>
                            {translation.changeUploadingFile}
                        </div>
                    </div> 
                );
            } else if (file) {
                return (
                    <div className={css.dropzoneUploadedWrap}>
                        {(() => {
                            if (file.type.startsWith('image')) {
                                return (
                                    <img
                                        className={css.uploadPic}
                                        src={file.preview} />
                                )
                            } else {
                                return <i className={`fa fa-file-o ${css.icon}`} />
                            }
                        })()}
                        <div className={css.dropzoneText}>
                            {file.name}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={css.dropzoneWrap}>
                        <i className={`fa fa-upload ${css.icon}`} />
                        <div className={css.dropzoneText}>
                            {translation.uploadFile}
                        </div>
                    </div>
                )
            }
        });

        return (
            <div className={css.wrap}>
                <div className={css.left}>
                    <h1 className={css.featured}>
                        {translation.uploadFile}
                    </h1>
                    <div className={css.upload}>
                        <Dropzone 
                            className={css.dropzone}
                            activeClassName={css.dropzoneActive}
                            onDrop={this.onDrop}
                            multiple={false}
                            disableClick={!!file}>
                            {dropzoneContent}
                        </Dropzone>
                    </div>
                </div>
                <div 
                    className={file ? css.expandedRight : css.right}>
                    <div className={css.rightContainer}>
                        <div className={css.title}>
                            {translation.fileInfo}
                        </div>
                        <div className={css.label}>
                            {translation.filename}
                        </div>
                        <input 
                            className={css.input}
                            value={filename}
                            onChange={(event) => this.setState({ filename: event.target.value })}
                            ref={(input) => this.filenameInput = input} />
                        <div className={css.label}>
                            {translation.description}
                        </div>
                        <textarea
                            className={css.textarea}
                            value={content}
                            onChange={(event) => this.setState({ content: event.target.value })}
                            placeholder={translation.whatFile} />
                        <div className={css.label}>
                            {translation.tags}
                        </div>
                        <TagInput
                            tags={tags}
                            suggestions={tagSuggestions}
                            onTagAdded={this.onTagAdded}
                            onTagRemoved={this.onTagRemoved}
                            onTagUpdated={this.onTagUpdated} />
                        <button
                            type="submit"
                            className={ uploading ? css.uploadingBtn : css.uploadBtn }
                            onClick={this.onUpload}>
                            { uploading ? translation.uploading : translation.upload }
                        </button>
                    </div>
                </div>
                <div
                    className={file ? css.expandedClose : css.close}
                    onClick={() => onClose()}>
                    &times;
                </div>
            </div>  
        );
    }
}

export default UploadFile;