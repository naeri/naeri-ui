import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import _ from 'utils';

import Settings from 'settings.js';
import css from './style.css';

class Document extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        browserHistory.push(`/view/${this.props.document.id}`);
    }

    render() {
        const translation = this.context.translation;
        const { document } = this.props;

        let tags = document.tags.map((tag) => {
            return (
                <span 
                    className={css.tag}
                    key={tag.title}
                    style={{ background: tag.color }}>
                    {tag.title}
                </span>
            );
        })

        return (
            <div
                className={css.documentWrap}
                onClick={this.onClick}>
                <div className={css.profileImage}>
                    <img src={`${Settings.host}/user/${document.author.id}/picture`} />
                </div>
                <div className={css.document}>
                    <header className={css.header}>
                        <div className={css.title}>
                            {document.title}
                        </div>
                        <div className={css.tags}>
                            {tags}
                        </div>
                    </header>
                    <hr className={css.hr} />
                    <div className={css.content}>
                        {document.content.substring(0, 100)}
                        {document.content.length > 100 ? ' ...' : ''}
                    </div>
                    <footer className={css.footer}>
                        <i className="fa fa-refresh" />
                        {' '}
                        {_.format(
                            translation.updated, 
                            document.author.username, 
                            moment(document.createdAt).format(translation.updatedTimeFormat)
                        )}
                    </footer>
                </div>
            </div>
        )
    }
}

Document.contextTypes = {
    translation: React.PropTypes.object
}

export default Document;