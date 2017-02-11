import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

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
                <div className={css.userInfo}>
                    <div className={css.profileImage}>
                        <img src={`${Settings.host}/user/${document.author.id}/picture`} />
                    </div>
                    <div className={css.authorWrap}>
                        <div className={css.author}>
                            {document.author.name}
                            <span className={css.small}>
                                @{document.author.id}
                            </span>
                        </div>
                        <div className={css.meta}>
                            <span className={css.updated}>
                                {moment(document.createdAt).locale(translation.lang).fromNow()}
                            </span>
                        </div>
                    </div>
                    <div className={css.tags}>
                        { 
                            tags.length > 0 ? 
                            tags :
                            ''
                        }  
                    </div>
                </div>
                
                <div className={css.document}>
                    <header className={css.title}>
                        {document.title}
                    </header>
                    <div className={css.content}>
                        {document.content.substring(0, 200)}
                        {document.content.length > 200 ? ' ...' : ''}
                    </div>
                </div>
            </div>
        )
    }
}

Document.contextTypes = {
    translation: React.PropTypes.object
}

export default Document;