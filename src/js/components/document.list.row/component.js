import React from 'react';
import moment from 'moment';

import Settings from '../../settings.js';
import css from './style.css';

class DocumentListRowComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tags = this.props.document.tags.map((tag) => {
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
                className={css.documentWrap}>
                <div className={css.profileImage}>
                    <img src={`${Settings.host}/user/picture/${this.props.document.author._id}`} />
                </div>
                <div className={css.document}>
                    <header className={css.header}>
                        <div className={css.title}>
                            {this.props.document.title}
                        </div>
                        <div className={css.tags}>
                            {tags}
                        </div>
                    </header>
                    <hr className={css.hr} />
                    <div className={css.content}>
                        {this.props.document.markdown.substring(0, 100)}
                        {this.props.document.markdown.length > 100 ? ' ...' : ''}
                    </div>
                    <footer className={css.footer}>
                        <i className="fa fa-refresh" />
                        {' '}
                        <b>{this.props.document.author.username}</b>님이
                        {' '} 
                        {moment(this.props.document.createdAt).format(' MM월 DD일').replace(/ 0/gi, ' ')}에
                        {' '}
                        업데이트함
                    </footer>
                </div>
            </div>
        )
    }
}

export default DocumentListRowComponent;