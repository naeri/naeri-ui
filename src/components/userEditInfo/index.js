import React from 'react';

import css from './style.css';

import Settings from 'settings';
import moment from 'moment';

class UserEditInfo extends React.Component {
    static contextTypes = {
        translation: React.PropTypes.object
    }

    render() {
        const { id, name, updated } = this.props;
        const { translation } = this.context;

        return (
            <div className={css.author}>
                <img
                    className={css.pic} 
                    src={`${Settings.host}/user/${id}/picture`} />
                <div className={css.metaWrap}>
                    <div className={css.authorWrap}>
                        <span className={css.authorName}>{name}</span>
                        <span className={css.authorId}>@{id}</span>
                    </div>
                    <div className={css.updated}>
                        {moment(updated).locale(translation.lang).fromNow()} 
                    </div>
                </div>
            </div>
        );
    }
}

export default UserEditInfo;