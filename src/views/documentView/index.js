import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'utils';

import CommentInput from './components/commentInput';
import CommentView from './components/commentView';
import TagsList from './components/tagsList';
import Spinner from 'components/spinner';
import SelectionMenu from './components/selectionMenu';

import utils from 'utils';
import SelectionManager from 'utils/selectionManager';

import css from './style.css';

class DocumentView extends React.Component {
    getChildContext() {
        return {
            translation: this.props.translation
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            document: undefined,
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

    async componentDidMount() {
        const documentId = this.props.params.documentId;

        try {
            let document = await this.context.documentModule.getDocument(documentId);

            this.setState({
                document: document
            });
        } catch (e) {
            this.setState({
                document: null
            });
        }
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

    async onCommentAdded() {
        const documentId = this.props.documentId;
        const documentModule = this.props.documentModule;

        this.setState({
            document: undefined,
            comments: null
        });

        let document = await documentModule.getDocument(documentId)
            
        return this.setState({
            document: document,
            showSelectionMenu: false,
            selectionInfo: null,
            commentInputShow: false
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
        const { document } = this.state;
        const { translation } = this.props;

        if (document === undefined) {
            return <Spinner />;
        }

        if (document === null) {
            return <div className={css.wrap}>{translation.cannotFind}</div>;
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
                                &lt; {translation.goBack}
                            </Link>
                        </div>
                        {(() => {
                            if (this.state.document) {
                                return (
                                    <div className={css.right}>
                                        <a>
                                            <i className="fa fa-pencil" />
                                            {' '}
                                            {translation.edit}
                                        </a>
                                        <a>
                                            <i className="fa fa-history" />
                                            {' '}
                                            {translation.history}
                                        </a>
                                        <a>
                                            <i className="fa fa-trash" />
                                            {' '}
                                            {translation.delete}
                                        </a>
                                    </div>
                                )
                            }
                        })()}
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
                                    {_.format(
                                        translation.updated, 
                                        document.author.username, 
                                        moment(document.createdAt).format(translation.updatedTimeFormat)
                                    )}
                                </div>
                                <div className={css.tags}>
                                    {tags}
                                </div>
                            </div>
                        </header>
                        <section 
                            className={css.content}
                            dangerouslySetInnerHTML={{ __html: document.content }}
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

DocumentView.childContextTypes = {
    translation: React.PropTypes.object
}

DocumentView.contextTypes = {
    documentModule: React.PropTypes.object
};

export default DocumentView;