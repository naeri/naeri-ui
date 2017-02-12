import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

import Spinner from 'components/spinner';
import Button from 'components/topMenuButton';
import UserEditInfo from 'components/userEditInfo';

import css from './style.css';

class FileView extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            file: undefined,
            comments: undefined,
        };
    }

    static childContextTypes = {
        translation: React.PropTypes.object,
    }

    static contextTypes = {
        fileModule: React.PropTypes.object
    };

    async componentDidMount() {
        const { fileModule } = this.context;
        const { fileId } = this.props.params;

        this.setState({
            file: undefined,
            comments: undefined
        });

        try {
            const file = await fileModule.getFile(fileId);

            this.setState({
                file: file
            });
        } catch (e) {
            this.setState({
                file: null
            });
        }
    }
    
    render() {
        const { file } = this.state;
        const { translation } = this.props;

        if (file === undefined) {
            return <Spinner />;
        }

        if (file === null) {
            return <div>{translation.couldntLoadFile}</div>
        }

        const comments = (() => {

        })();

        const modal = (() => {

        })();

        return (
            <div className={css.wrap}>
                <div className={css.menus}>
                    <div className={css.left}>
                        <Button 
                            iconId="angle-left" 
                            content={translation.toList} 
                            onClick={() => browserHistory.push(`/files`)}/>
                    </div>
                    <div className={css.right}>
                        <Button 
                            iconId="pencil" 
                            content={translation.edit} 
                            onClick={() => browserHistory.push(`/file/edit/${file.id}`)} />
                        <Button 
                            iconId="history" 
                            content={translation.history}
                            onClick={() => browserHistory.push(`/file/history/${file.id}`)} />
                        {(() => {
                            if (!file.isArchived) {
                                return (
                                    <Button 
                                        iconId="archive" 
                                        content={translation.archive} 
                                        onClick={this.onFileDeleting}/>
                                );
                            }
                        })()}
                    </div>
                </div>
                <section 
                    className={css.fileWrap}>
                    <div className={css.grid}>
                        <div className={css.file}>
                            <UserEditInfo 
                                id={file.author.id}
                                name={file.author.name}
                                updated={file.createdAt} />
                            <div className={css.title}>
                                <div className={css.titleText}>
                                    {file.title}
                                </div>
                            </div>
                            <div className={css.content}>
                                <div className="file inline">
                                    <div className="fileIcon">
                                        <i className="fa fa-file-o" />
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
                                </div>
                            </div>
                        </div>
                        <div 
                            className={css.sidebar}
                            ref={(comments) => this.comments = comments}>
                            {(() => {
                                if (file.tags.length > 0) {
                                    return (
                                        <div className={css.meta}>
                                            <div className={css.metaTitle}>
                                                태그
                                            </div>
                                            <div className={css.tags}>
                                                {file.tags.map(({ color, title }, i) => (
                                                    <span 
                                                        className={css.tag}    
                                                        style={{ backgroundColor: color }}
                                                        key={i}>
                                                        {title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                            })()}

                            <div className={css.comments}>
                                {comments}
                            </div>
                        </div>
                    </div>
                </section>
                {modal}
            </div>
        )
    }
}

export default FileView;