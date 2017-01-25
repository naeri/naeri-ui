import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import CommentInput from './components/commentInput';
import CommentView from './components/commentView';
import TagsList from './components/tagsList';
import Spinner from 'components/spinner';
import SelectionMenu from './components/selectionMenu';

import utils from 'utils';
import SelectionManager from 'utils/selectionManager';

import css from './style.css';

class DocumentModule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            document: null,
            showSelectionMenu: false,
            selectionInfo: null,
            comments: null,
            commentInputShow: false,
            contentKey: +new Date()
        };

        this.commentViews = [];

        this.selectionManager = new SelectionManager();

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onSelectionCreated = this.onSelectionCreated.bind(this);
        this.onCommentAdding = this.onCommentAdding.bind(this);
        this.onCommentAdded = this.onCommentAdded.bind(this);
        this.onSelectionMenuSelected = this.onSelectionMenuSelected.bind(this);
        this.onHighlightSection = this.onHighlightSection.bind(this);
        this.onClearHighlight = this.onClearHighlight.bind(this);
    }

    componentDidMount() {
        const documentId = this.props.documentId;
        const self = this;

        this.props.documentModule.getDocument(documentId)
            .then(function(document) {
                self.setState({
                    document: document
                });
            });
    }

    componentDidUpdate() {
        if (!this.state.document || this.state.comments) {
            return;
        }

        const children = this.contentSection.children;

        for (let i = 0; i < children.length; i++) {
            children[i].order = i;
        }

        const organizedComments = {};
        const comments = [];

        this.state.document.comments.forEach((comment) => {
            const range = this.selectionManager.importSelection(this.contentSection, comment.range);
            const rect = range.getBoundingClientRect();
            const top = this.getPos(rect).Y;

            if (!organizedComments[top]) {
                organizedComments[top] = [];
            }

            organizedComments[top].push(comment);
        });

        for (var top in organizedComments) {
            comments.push(
                <CommentView
                    key={top}
                    comments={organizedComments[top]}
                    top={top} 
                    onHighlightComment={this.onHighlightSection}
                    onClearHighlight={this.onClearHighlight} />
            )
        }

        this.setState({
            comments: comments
        });
    }

    getPos(rect) {
        const doc = document.documentElement;
        const scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        
        return {
            X: rect.left + rect.width / 2,
            Y: scrollTop + rect.top
        };
    }
    
    getSelectionContainsContent() {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed || !selection.rangeCount) {
            return false;
        }

        if (selection.toString().trim() !== '') {
            return true;
        }

        return false;
    }

    onMouseUp(event) {
        // There is a bug where the selection object is not updated 
        // when we click inside the selection object
        setTimeout(() => {
            this.onSelectionCreated();
        }, 0)
    }

    onMouseDown() {
        this.setState({
            selectionInfo: null,
            commentInputShow: false,
            contentKey: +new Date()
        });
    }

    onSelectionCreated() {
        const selection = window.getSelection();

        if (!this.getSelectionContainsContent()) {
            this.setState({
                showSelectionMenu: false,
                selectionInfo: null,
                commentInputShow: false
            });
            return;
        }

        const position = this.getPos(selection.getRangeAt(0).getBoundingClientRect())

        this.setState({
            selectionX: position.X,
            selectionY: position.Y,
            showSelectionMenu: true
        });
    }

    onCommentAdding() {
        this.setState({
            commentInputShow: true
        });
    }

    onCommentAdded() {
        const self = this;
        const documentId = this.props.documentId;
        const documentModule = this.props.documentModule;

        this.setState({
            document: null,
            comments: null
        });

        documentModule.getDocument(documentId)
            .then(function(document) {
                return self.setState({
                    document: document,
                    showSelectionMenu: false,
                    selectionInfo: null,
                    commentInputShow: false
                });
            });

    }

    onSelectionMenuSelected() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const manager = this.selectionManager;

        const selectionInfo = manager.exportSelection(this.contentSection);
        manager.highlight(range, css.highlight);

        this.setState({
            showSelectionMenu: false,
            selectionInfo: selectionInfo
        });

        selection.removeAllRanges();
    }

    onHighlightSection(range) {
        const manager = this.selectionManager;
        range = manager.importSelection(this.contentSection, range);
        manager.highlight(range, css.highlight);
    }

    onClearHighlight() {
        this.setState({
            contentKey: +new Date()
        });
    }

    render() {
        const document = this.state.document;

        if (!document) {
            return <Spinner />;
        }

        const tags = <TagsList tags={document.tags} />;
        
        const commentMenu = (() => {
            if (this.state.showSelectionMenu) {
                return <SelectionMenu 
                            X={this.state.selectionX}
                            Y={this.state.selectionY}
                            onMenuSelected={this.onSelectionMenuSelected}
                            onCommentAdding={this.onCommentAdding}/>;
            } else {
                return null;
            }
        })();

        const commentInput = (() => {
            if (this.state.commentInputShow) {
                return <CommentInput
                            Y={this.state.selectionY}
                            selectionInfo={this.state.selectionInfo}
                            onCommentAdded={this.onCommentAdded} 
                            documentModule={this.props.documentModule}
                            documentId={this.props.documentId} />
            } else {
                return null;
            }
        })();
        
        return (
            <div>
                <div 
                    className={css.wrap}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    onDragEnd={this.onMouseUp}>
                    <div className={css.topMenu}>
                        <div className={css.left}>
                            <Link to="/">
                                &lt; 목록으로 돌아가기
                            </Link>
                        </div>
                        <div className={css.right}>
                            <a>
                                <i className="fa fa-pencil" />
                                {' '}
                                수정
                            </a>
                            <a>
                                <i className="fa fa-history" />
                                {' '}
                                역사
                            </a>
                            <a>
                                <i className="fa fa-trash" />
                                {' '}
                                지우기
                            </a>
                        </div>
                    </div>
                    <div className={css.document}>
                        <header className={css.header}>
                            <h1 className={css.title}>
                                {document.title}
                            </h1>
                            <div className={css.meta}>
                                <div className={css.authorDate}>
                                    <i className="fa fa-refresh" />
                                    {' '}
                                    <b>{document.author.username}</b>님이
                                    {' '}
                                    {moment(document.createdAt).format('M월 D일')}에 업데이트함
                                </div>
                                <div className={css.tags}>
                                    {tags}
                                </div>
                            </div>
                        </header>
                        <section 
                            className={css.content}
                            dangerouslySetInnerHTML={{ __html: document.html }}
                            ref={(section) => { this.contentSection = section; }}
                            key={this.state.contentKey}>
                        </section>
                    </div>
                </div>
                {commentMenu}
                {commentInput}
                {this.state.commentInputShow ? null : this.state.comments}
            </div>
        )
    }
}

export default DocumentModule;