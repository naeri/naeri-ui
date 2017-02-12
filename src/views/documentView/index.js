import React from 'react';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';
import ClickOutside from 'react-click-outside';
import FontObserver from 'fontfaceobserver';
import moment from 'moment';

import Spinner from 'components/spinner';
import SelectionMenu from './components/selectionMenu';
import CommentView from './components/commentView';
import CommentForm from './components/commentForm';
import ArchiveDocument from './components/archiveDocument';
import DeleteComment from './components/deleteComment';
import CommentGroup from './components/commentGroup';
import Button from 'components/topMenuButton';
import UserEditInfo from 'components/userEditInfo';

import { 
    importSelection, 
    exportSelection,
    highlight,
    dehighlight,
    selectionContainsContent
} from 'utils/selectionManager';
import { isDescendant, format, hexToRgb } from 'utils';
import Settings from 'settings';

import css from './style.css';

const GROUP_HEIGHT = 180;
const ARCHIVE_DOCUMENT = 'archiveDocument';
const DELETE_COMMENT = 'deleteComment';
const COMMENT_GROUP = 'commentGroup';

const colors = Settings.colors.map((color) => {
    const rgba = {
        ...hexToRgb(color),
        a: .2
    };

    return format('rgba({0}, {1}, {2}, {3})', rgba.r, rgba.g, rgba.b, rgba.a);
});

const modalFactory = (() => {
    const factory = {};

    factory[ARCHIVE_DOCUMENT] = ArchiveDocument;
    factory[DELETE_COMMENT] = DeleteComment;
    factory[COMMENT_GROUP] = CommentGroup;

    return factory;
})();

class DocumentView extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation,
            documentId: this.props.params.documentId
        }
    }
    
    getSelection() {
        return window.getSelection().getRangeAt(0);
    }

    constructor(props) {
        super(props);

        this.state = {
            document: undefined,
            selectionInfo: null,
            showSelectionMenu: false,
            commentFormInfo: null,
            expandCommentTop: -1,
            comments: undefined,
            selectedCommentId: undefined,
            modalInfo: null
        };

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onSelectionMenuSelected = this.onSelectionMenuSelected.bind(this);
        this.onCommentAdding = this.onCommentAdding.bind(this);
        this.onContentClickOutside = this.onContentClickOutside.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onCommentExpand = this.onCommentExpand.bind(this);
        this.onCommentEditing = this.onCommentEditing.bind(this);
        this.onCommentDeleting = this.onCommentDeleting.bind(this);
        this.onCommentGroupSelected = this.onCommentGroupSelected.bind(this);
        this.onDocumentDeleting = this.onDocumentDeleting.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    static childContextTypes = {
        translation: React.PropTypes.object,
        documentId: React.PropTypes.string
    }

    static contextTypes = {
        documentModule: React.PropTypes.object
    };

    async componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);

        await this.refresh();
    }

    async componentDidUpdate() {
        const { document, comments } = this.state;
        const font = new FontObserver('Spoqa Han Sans');

        if (document && comments === undefined) {
            await font.load();
            this.loadComments();
        }
    }

    onMouseDown() {
        // There is a bug where the selection object is not updated 
        // when we click inside the selection object
        setTimeout(() => {
            dehighlight(this.contentContainer, css.selectionHighlight)

            const { commentFormInfo, showSelectionMenu } = this.state;

            // If a selection is cancelled,
            // there exists 3 situations:

            // 1st. Selection menu and comment form both are not shown.
            // then, we should do nothing.

            // 2nd. Selection menu is shown but comment form is not shown.
            // then, we should make the selection object null hide selection menu.
            if (showSelectionMenu && !commentFormInfo) {
                this.setState({
                    selectionInfo: null,
                    showSelectionMenu: false
                });
            }

            // 3rd. Selection menu is hidden and the comment form is shown.
            // then, we should dehighlight the content container and make the selection null.
            // Finally, we hide the comment form.
            if (!showSelectionMenu && commentFormInfo) {
                this.hideCommentForm();
            }
        }, 0);
    }

    onMouseUp() {
        // There is a bug where the selection object is not updated 
        // when we click inside the selection object
        setTimeout(() => this.onSelectionCreated(), 0);
    }

    onSelectionCreated() {
        const selection = window.getSelection();

        if (!selectionContainsContent(selection)) {
            return;
        }

        if (!isDescendant(this.contentContainer, selection.anchorNode)) {
            return;
        }

        this.setState({
            selectionInfo: exportSelection(this.contentContainer),
            showSelectionMenu: true
        });
    }

    onSelectionMenuSelected() {
        dehighlight(this.contentContainer, css.selectionHighlight);

        this.setState({ 
            selectionInfo: null, 
            showSelectionMenu: false 
        });
    }

    onCommentAdding() {
        highlight(this.getSelection(), css.selectionHighlight);
        window.getSelection().empty();

        this.setState({
            showSelectionMenu: false,
            commentFormInfo: {}
        });
    }

    onContentClickOutside(event) {
        const { target } = event;

        if ((this.comments !== target) &&
            !findDOMNode(this.comments).contains(target)) {
            dehighlight(this.contentContainer, css.selectionHighlight);

            this.setState({ 
                selectionInfo: null, 
                commentFormInfo: null, 
                showSelectionMenu: false 
            });
        }
    }

    hideCommentForm() {
        dehighlight(this.contentContainer, css.selectionHighlight);

        this.setState({
            selectionInfo: null,
            commentFormInfo: null
        })
    }
    
    async refresh(commentId) {
        const { documentModule } = this.context;
        const { documentId } = this.props.params;

        this.setState({
            document: undefined,
            comments: undefined,
            selectionInfo: null,
            commentFormInfo: null,
            showSelectionMenu: false,
            selectedCommentId: undefined,
            modalInfo: null
        });

        try {
            const document = await documentModule.getDocument(documentId);

            this.setState({
                document: document,
                selectedCommentId: commentId
            });
        } catch (e) {
            this.setState({
                document: null
            });
        }
    }

    onWindowResize() {
        this.loadComments();
    }
    
    onCommentExpand(top) {
        const { expandCommentTop } = this.state;

        if (top === expandCommentTop) {
            dehighlight(this.contentContainer, css.commentHighlight)

            top = -1;
        } else {
            this.highlightComments(top);
        }

        this.setState({
            expandCommentTop: top
        });
    }

    highlightComments(top) {
        const { comments } = this.state;
        const commentGroups = comments[top];

        if (!commentGroups) {
            return;
        }

        dehighlight(this.contentContainer, css.commentHighlight);

        commentGroups.forEach((commentGroup) => {
            const range = importSelection(this.contentContainer, commentGroup.range);
            const { color } = commentGroup;

            highlight(range, css.commentHighlight, color);
        });
    }

    onCommentEditing(range, commentId, content) {
        const selection = importSelection(this.contentContainer, range);
        highlight(selection, css.selectionHighlight);

        this.setState({
            selectionInfo: range,
            commentFormInfo: {
                content: content,
                id: commentId
            }
        });
    }

    onDocumentDeleting() {
        const { document } = this.state;

        this.setState({
            modalInfo: {
                name: ARCHIVE_DOCUMENT,
                props: {
                    documentId: document.id,
                    onClose: this.onModalClose
                }
            }
        });
    }

    onCommentDeleting(commentId) {
        this.setState({
            modalInfo: {
                name: DELETE_COMMENT,
                props: {
                    commentId: commentId,
                    onClose: this.onModalClose,
                    onDeleted: this.refresh
                }
            }
        });
    }

    onCommentGroupSelected(commentGroup) {
        this.setState({
            modalInfo: {
                name: COMMENT_GROUP,
                props: {
                    commentGroup: commentGroup,
                    onCommentAdded: this.refresh,
                    onClose: this.onModalClose
                }
            }
        })
    }

    onModalClose() {
        this.setState({
            modalInfo: null
        });
    }

    loadComments() {
        try {
            dehighlight(this.contentContainer, css.commentHighlight);

            const { document, selectedCommentId } = this.state;
            const { comments } = document;

            let groupingTop = undefined;
            let colorIndex = 0;
            let selectedCommentTop = undefined;

            const groupedComments = comments
                .sort((a, b) => {
                    const aDate = Date.parse(a.createdAt);
                    const bDate = Date.parse(b.createdAt);

                    return a.range.start - b.range.start || bDate - aDate; 
                })
                .reduce((groupedComments, comment) => {
                    const range = importSelection(this.contentContainer, comment.range);
                    let top = range.getBoundingClientRect().top - this.wrap.getBoundingClientRect().top;

                    if (groupingTop >= 0 && top - groupingTop < GROUP_HEIGHT) {
                        top = groupingTop;

                        const commentGroups = groupedComments[top];
                        const lastCommentGroup = commentGroups[commentGroups.length - 1];

                        if (lastCommentGroup.range.start === comment.range.start &&
                            lastCommentGroup.range.end === comment.range.end) {
                            lastCommentGroup.comments.push(comment);
                        } else {
                            commentGroups.push({
                                range: comment.range,
                                color: colors[colorIndex++ % colors.length],
                                content: range.toString(),
                                comments: [comment]
                            });
                        }

                        commentGroups.count++;
                    } else {
                        groupingTop = top;

                        const commentGroups = [{
                            range: comment.range,
                            color: colors[colorIndex++ % colors.length],
                            content: range.toString(),
                            comments: [comment]
                        }];
                        commentGroups.count = 1;

                        groupedComments[top] = commentGroups;
                    }

                    if (comment.id === selectedCommentId) {
                        selectedCommentTop = top;
                    }

                    return groupedComments;
                }, {});

            this.setState({
                comments: groupedComments,
                expandCommentTop: selectedCommentTop || -1,
                selectedCommentId: null
            }, () => {
                this.highlightComments(selectedCommentTop);
            });
        } catch (e) {
            this.setState({
                comments: null,
                expandCommentTop: -1,
                showCommentId: null
            });
        }
    }
    
    render() {
        const { 
            document,
            comments: _comments,
            showSelectionMenu,
            commentFormInfo,
            expandCommentTop,
            selectionInfo,
            modalInfo
        } = this.state;
        const { translation } = this.props;

        if (document === undefined) {
            return <Spinner />;
        }

        if (document === null) {
            return <div className={css.wrap}>{translation.cannotFind}</div>;
        }

        const position = (() => {
            if (!this.contentContainer || !selectionInfo) {
                return;
            }

            const rect = importSelection(this.contentContainer, selectionInfo).getBoundingClientRect();
            const { scrollTop } = this.wrap;

            const top = rect.top - this.wrap.getBoundingClientRect().top;
            const left = rect.left - this.wrap.getBoundingClientRect().left;

            return {
                X: left + rect.width / 2,
                Y: scrollTop + top
            }
        })();

        const selectionMenu = (() => {
            if (showSelectionMenu) {
                const { X, Y } = position;

                return (
                    <SelectionMenu
                        X={X} Y={Y}
                        onCommentAdding={this.onCommentAdding}
                        onMouseUp={this.onSelectionMenuSelected} />
                );
            }

            return null;
        })();

        const commentForm = (() => {
            if (commentFormInfo) {
                const { Y } = position;

                return (
                    <ClickOutside
                        onClickOutside={() => this.hideCommentForm()}>
                        <CommentForm 
                            Y={Y}
                            selectionInfo={selectionInfo}
                            documentId={document.id}
                            onCommentUpdated={(commentId) => this.refresh(commentId)}
                            commentInfo={commentFormInfo} />
                    </ClickOutside>
                );
            }
        })();

        const comments = (() => {
            if (_comments) {
                return Object.keys(_comments).map((top, i) => {
                    return (
                        <CommentView 
                            key={top}
                            groupedComments={_comments[top]}
                            top={top} 
                            show={!commentFormInfo && (expandCommentTop == -1 || expandCommentTop == top)}
                            expand={expandCommentTop == top}
                            onExpand={this.onCommentExpand}
                            onCommentEditing={this.onCommentEditing}
                            onCommentDeleting={this.onCommentDeleting}
                            onCommentGroupSelected={this.onCommentGroupSelected} />
                    );
                });
            }

            return null;
        })();

        const modal = (() => {
            if (!modalInfo) {
                return;
            }

            const Modal = modalFactory[modalInfo.name];

            return (
                <div className={css.modalWrap}>
                    <Modal {...modalInfo.props}/>
                </div>
            );
        })();

        return (
            <div className={css.wrap}>
                <div className={css.menus}>
                    <div className={css.left}>
                        <Button 
                            iconId="angle-left" 
                            content={translation.toList} 
                            onClick={() => browserHistory.push(`/`)}/>
                    </div>
                    <div className={css.right}>
                        <Button 
                            iconId="pencil" 
                            content={translation.edit} 
                            onClick={() => browserHistory.push(`/edit/${document.id}`)} />
                        <Button 
                            iconId="history" 
                            content={translation.history}
                            onClick={() => browserHistory.push(`/history/${document.id}`)} />
                        {(() => {
                            if (!document.isArchived) {
                                return (
                                    <Button 
                                        iconId="archive" 
                                        content={translation.archive} 
                                        onClick={this.onDocumentDeleting}/>
                                );
                            }
                        })()}
                    </div>
                </div>
                <section 
                    className={css.documentWrap}
                    ref={(wrap) => this.wrap = wrap}>
                    <div className={css.grid}>
                        <div className={css.document}>
                            <UserEditInfo 
                                id={document.author.id}
                                name={document.author.name}
                                updated={document.createdAt} />
                            <div className={css.title}>
                                <div className={css.titleText}>
                                    {document.title}
                                </div>
                            </div>
                            <ClickOutside 
                                onClickOutside={this.onContentClickOutside}>
                                <div
                                    className={commentFormInfo ? css.noHighlightContent : css.content}
                                    dangerouslySetInnerHTML={{ __html: document.parsedContent }}
                                    onMouseDown={this.onMouseDown}
                                    onMouseUp={this.onMouseUp}
                                    ref={(container) => this.contentContainer = container} />
                                {selectionMenu}
                            </ClickOutside>
                        </div>
                        <div 
                            className={css.sidebar}
                            ref={(comments) => this.comments = comments}>
                            {(() => {
                                if (document.tags.length > 0) {
                                    return (
                                        <div className={css.meta}>
                                            <div className={css.metaTitle}>
                                                태그
                                            </div>
                                            <div className={css.tags}>
                                                {document.tags.map(({ color, title }, i) => (
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
                            {commentForm}
                        </div>
                    </div>
                </section>
                {modal}
            </div>
        )
    }
}

export default DocumentView;