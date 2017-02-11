import React from 'react';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';
import ClickOutside from 'react-click-outside';
import FontObserver from 'fontfaceobserver';

import Spinner from 'components/spinner';
import SelectionMenu from './components/selectionMenu';
import CommentView from './components/commentView';
import CommentForm from './components/commentForm';

import { 
    importSelection, 
    exportSelection,
    highlight,
    dehighlight,
    selectionContainsContent
} from 'utils/selectionManager';

import css from './style.css';

const GROUP_HEIGHT = 180;

const Button = ({ iconId, content, onClick }) => (
    <div 
        className={css.button}
        onClick={onClick}>
        <i className={`fa fa-${iconId} ${css.icon}`} />
        <span className={css.buttonText}>
            {content}
        </span>
    </div>
);

class DocumentView extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation
        }
    }
    
    getSelection() {
        return window.getSelection().getRangeAt(0);
    }

    constructor(props) {
        super(props);

        this.state = {
            document: undefined,
            selection: null,
            showSelectionMenu: false,
            showCommentForm: false,
            expandCommentTop: -1,
            comments: null
        };

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onSelectionMenuSelected = this.onSelectionMenuSelected.bind(this);
        this.onCommentAdding = this.onCommentAdding.bind(this);
        this.onContentClickOutside = this.onContentClickOutside.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onHighlightComment = this.onHighlightComment.bind(this);
        this.onCommentExpand = this.onCommentExpand.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    async componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);

        await this.refresh();
    }

    async componentDidUpdate() {
        const { document, comments } = this.state;
        const font = new FontObserver('Spoqa Han Sans');

        if (document && !comments) {
            await font.load();
            this.loadComments();
        }
    }

    onMouseDown() {
        // There is a bug where the selection object is not updated 
        // when we click inside the selection object
        setTimeout(() => {
            dehighlight(this.contentContainer, css.highlight)

            const { showCommentForm, showSelectionMenu } = this.state;

            // If a selection is cancelled,
            // there exists 3 situations:

            // 1st. Selection menu and comment form both are not shown.
            // then, we should do nothing.

            // 2nd. Selection menu is shown but comment form is not shown.
            // then, we should make the selection object null hide selection menu.
            if (showSelectionMenu && !showCommentForm) {
                this.setState({
                    selection: null,
                    showSelectionMenu: false
                });
            }

            // 3rd. Selection menu is hidden and the comment form is shown.
            // then, we should dehighlight the content container and make the selection null.
            // Finally, we hide the comment form.
            if (!showSelectionMenu && showCommentForm) {
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

        const _rect = selection.getRangeAt(0).getBoundingClientRect();
        const position = ((rect) => {
            const { scrollTop } = this.wrap;

            const top = rect.top - this.wrap.getBoundingClientRect().top;
            const left = rect.left - this.wrap.getBoundingClientRect().left;

            return {
                X: left + rect.width / 2,
                Y: scrollTop + top
            }
        })(_rect);

        this.setState({
            selection: {
                info: { ...exportSelection(this.contentContainer) },
                menuPos: { ...position }
            },
            showSelectionMenu: true
        });
    }

    onSelectionMenuSelected() {
        dehighlight(this.contentContainer, css.highlight);

        this.setState({ 
            selection: null, 
            showSelectionMenu: false 
        });
    }

    onCommentAdding() {
        highlight(this.getSelection(), css.highlight);
        window.getSelection().empty();

        this.setState({
            showSelectionMenu: false,
            showCommentForm: true 
        });
    }

    onContentClickOutside(event) {
        const { target } = event;

        if ((this.comments !== target) &&
            !findDOMNode(this.comments).contains(target)) {
            dehighlight(this.contentContainer, css.highlight);

            this.setState({ 
                selection: null, 
                showCommentForm: false, 
                showSelectionMenu: false 
            });
        }
    }

    hideCommentForm() {
        dehighlight(this.contentContainer, css.highlight);

        this.setState({
            selection: null,
            showCommentForm: false
        })
    }
    
    async refresh() {
        const { documentModule } = this.context;
        const { documentId } = this.props.params;

        this.setState({
            document: undefined,
            comments: null,
            selection: null,
            showCommentForm: false,
            showSelectionMenu: false
        })

        try {
            const document = await documentModule.getDocument(documentId);

            this.setState({
                document: document
            });
        } catch (e) {
            console.log(e);
            
            this.setState({
                document: null
            });
        }
    }

    onWindowResize() {
        this.loadComments();
    }

    onHighlightComment(_range) {
        dehighlight(this.contentContainer, css.highlight);

        const range = importSelection(this.contentContainer, _range);
        highlight(range, css.highlight);
    }
    
    onCommentExpand(top) {
        const { expandCommentTop } = this.state;

        if (top === expandCommentTop) {
            top = -1;
        }

        this.setState({
            expandCommentTop: top
        });
    }

    loadComments() {
        try {
            const { comments } = this.state.document;

            const groupedComments = {};
            let groupingTop = undefined;

            comments
                .sort((a, b) => {
                    return a.range.start - b.range.start; 
                })
                .forEach((comment) => {
                    const range = importSelection(this.contentContainer, comment.range);
                    let top = range.getBoundingClientRect().top - this.wrap.getBoundingClientRect().top;

                    if (groupingTop >= 0 && top - groupingTop < GROUP_HEIGHT) {
                        top = groupingTop;
                    } else {
                        groupingTop = top;
                    }

                    if (!groupedComments[top]) {
                        groupedComments[top] = [];
                    }

                    groupedComments[top].push(comment);
                });

            this.setState({
                comments: groupedComments,
                expandCommentTop: -1
            })
        } catch (e) {
            this.setState({
                comments: null,
                expandCommentTop: -1
            });
        }
    }
    
    render() {
        const { 
            document,
            comments: _comments,
            showSelectionMenu,
            showCommentForm,
            expandCommentTop,
            selection
        } = this.state;
        const { translation } = this.props;

        if (document === undefined) {
            return <Spinner />;
        }

        if (document === null) {
            return <div className={css.wrap}>{translation.cannotFind}</div>;
        }

        const selectionMenu = (() => {
            if (showSelectionMenu) {
                const { X, Y } = selection.menuPos;

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
            if (showCommentForm) {
                const { Y } = selection.menuPos;

                return (
                    <ClickOutside
                        onClickOutside={() => this.hideCommentForm()}>
                        <CommentForm 
                            Y={Y}
                            selectionInfo={selection.info}
                            documentId={document.id}
                            onCommentAdded={this.refresh} />
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
                            comments={_comments[top]}
                            top={top} 
                            show={!showCommentForm && (expandCommentTop === -1 || expandCommentTop === top)}
                            expand={expandCommentTop === top}
                            onExpand={this.onCommentExpand}
                            onHighlightComment={this.onHighlightComment}
                            onDehighlightComment={() => dehighlight(this.contentContainer, css.highlight)} />
                    );
                });
            }

            return null;
        })();

        return (
            <div className={css.wrap}>
                <div className={css.menus}>
                    <div className={css.left}>
                        <Button 
                            iconId="chevron-left" 
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
                                        iconId="trash" 
                                        content={translation.delete} 
                                        onClick={() => browserHistory.push(`/delete/${document.id}`)}/>
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
                            <div className={css.title}>
                                {document.title}
                            </div>
                            <ClickOutside 
                                onClickOutside={this.onContentClickOutside}>
                                <div
                                    className={css.content}
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
                            <div className={css.meta}>
                            </div>
                            <div className={css.comments}>
                                {comments}
                            </div>
                            {commentForm}
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

DocumentView.childContextTypes = {
    translation: React.PropTypes.object
}

DocumentView.contextTypes = {
    documentModule: React.PropTypes.object
};

export default DocumentView;