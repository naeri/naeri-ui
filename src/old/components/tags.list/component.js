import React from 'react';

import css from './style.css';

class TagsList extends React.Component {
    render() {
        const tags = this.props.tags.map((tag) => {
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
            <div className={css.tags}>
                {tags}
            </div>
        );
    }
}

export default TagsList;