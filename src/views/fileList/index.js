import React from 'react';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';
import moment from 'moment';

import TagSelector from 'components/tagSelector';
import Spinner from 'components/spinner';
import UploadFile from './components/uploadFile';

import css from './style.css';

class FileList extends React.Component {
    static childContextTypes = {
        translation: React.PropTypes.object
    }

    static contextTypes = {
        tagModule: React.PropTypes.object,
        userModule: React.PropTypes.object,
        fileModule: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            files: null,
            lastFileId: null,
            tags: null,
            user: null,
            selectedTag: null,
            showUpload: false
        };

        this.onSelectedTagChanged = this.onSelectedTagChanged.bind(this);
    }

    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    async componentDidMount() {
        this.reloadTags();
        this.loadDocuments();
        
        let user = await this.context.userModule.getCurrentUser()
        this.setState({
            user: user
        });
    }

    async onSelectedTagChanged(tag) {
        let selectedTag = tag !== this.state.selectedTag ? tag : null;

        this.setState({
            selectedTag: selectedTag,
            lastFileId: null
        }, () => {
            this.loadDocuments();
        });
    }

    async loadDocuments() {
        const { fileModule, selectedTag } = this.context;
        const { lastFileId } = this.state;

        this.setState({
            documents: null
        });

        const id = selectedTag ? selectedTag.id : null;

        const files = await fileModule.getFiles(id, lastFileId);

        this.setState({
            files: files
        });
    }

    async reloadTags() {
        const { tagModule } = this.context;

        this.setState({
            tags: null
        });

        const tags = await tagModule.getTagList();
        
        this.setState({
            tags: tags
        });
    }

    render() {
        const { translation } = this.props;
        const {
            files: _files,
            tags: _tags,
            selectedTag,
            uploadFile,
            showUpload
        } = this.state;

        const tags = (() => {
            if (!_tags) {
                return <Spinner style={{ margin: '10px 0' }} />
            }

            return (
                <TagSelector
                    tags={_tags}
                    selectedTag={selectedTag}
                    selectedTagChanged={this.onSelectedTagChanged} />
            );
        })();

        const files = (() => {
            if (!_files) {
                return <Spinner style={{ margin: '10px 0' }} />
            }

            return _files.map((file, i) => (
                <div
                    className="file"
                    key={i}
                    onClick={() => browserHistory.push(`/file/${file.id}`)}>
                    <div className="fileIcon">
                        {(() => {
                            // TODO: implement various file icons
                            return <i className="fa fa-file-o" />
                        })()}
                    </div>
                    <div className="fileInfo">
                        <div className="fileName">
                            {file.title}
                        </div>
                        <div className="fileMeta">
                            <span className="fileMetaItem">
                                {file.author.name}
                                <span className="fileSmall">
                                    @{file.author.id}
                                </span>
                            </span>
                            <span className="fileMetaItem">
                                {moment(file.createdAt).locale(translation.lang).fromNow()}
                            </span>
                        </div>
                    </div>
                    <div className={css.tags}>
                        {file.tags.map((tag, i) => (
                            <span 
                                className={css.tag}
                                key={i}
                                style={{ background: tag.color }}>
                                {tag.title}
                            </span>
                        ))}
                    </div>
                </div>
            ));
        })();

        const modal = (() => {
            if (showUpload) {
                return (
                    <div className={css.modalWrap}>
                        <UploadFile
                            tagSuggestions={_tags}
                            onFileUploaded={this.onFileUploaded}
                            onClose={() => {this.setState({ showUpload: false })}} />
                    </div>
                )
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
                            {translation.files}
                        </span>
                        <span className={css.buttons}>
                            <button
                                className={css.button}
                                onClick={() => this.setState({ showUpload: true })}>
                                <i className="fa fa-upload" />
                            </button>
                        </span>
                    </div>
                    <div className={css.files}>
                        {files}
                    </div>
                </div>
                {modal}
            </div>
        );
    }
}

export default FileList;