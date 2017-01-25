import React from 'react';

import TagRow from './components/tagRow';
import Hangul from 'hangul-js';

import css from './style.css';

class TagSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: ''
        }

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.tagSelected = this.tagSelected.bind(this);
    }

    searchTextChanged(event) {
        this.setState({
            searchText: event.target.value
        });
    }

    tagSelected(tag) {
        this.props.selectedTagChanged(tag);
    }

    render() {
        const { translation } = this.context;

        var rows = [];

        this.props.tags.forEach((tag) => {
            if (Hangul.search(tag.title, this.state.searchText) < 0) {
                return;
            }

            rows.push(
                <TagRow 
                    key={tag.title}
                    tag={tag}
                    active={tag === this.props.selectedTag}
                    clicked={this.tagSelected} />
            );
        });

        rows.splice(10);

        return (
            <div className={css.selector}>
                <input 
                    type="text"
                    className={css.input}
                    placeholder={translation.searchTag}
                    value={this.state.searchText}
                    onChange={this.searchTextChanged} />
                <ul className={css.tags}>
                    {rows}
                </ul>
            </div>
        );
    }
}

TagSelector.contextTypes = {
    translation: React.PropTypes.object
};

export default TagSelector;