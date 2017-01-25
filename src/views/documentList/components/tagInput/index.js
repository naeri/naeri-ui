import React from 'react';
import Hangul from 'hangul-js';

import TagItem from './components/tagItem';

import css from './style.css';

class TagInputComponent extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            query: '',
            suggestions: [],
            selectedIndex: -1
        }

        this.onQueryChanged = this.onQueryChanged.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onAutoCompleteClick = this.onAutoCompleteClick.bind(this);
        this.onTagUpdated = this.onTagUpdated.bind(this);
        this.onTagRemoved = this.onTagRemoved.bind(this);
    }

    onQueryChanged(event) {
        let query = event.target.value;
        let suggestions = this.props.suggestions.filter((suggestion) => {
            return Hangul.search(suggestion.title, query) === 0;
        });

        this.setState({
            query: query,
            suggestions: suggestions,
            selectedIndex: -1
        });
    }

    onInputKeyDown(event) {
        // ENTER keypress
        if (event.keyCode == 13) {  
            event.preventDefault();

            if (this.state.selectedIndex != -1 ) {
                this.props.onTagAdded(this.state.suggestions[this.state.selectedIndex].title);
            } else {
                this.props.onTagAdded(this.input.value);
            }

            this.setState({
                query: '',
                suggestions: []
            });
        }

        // UP keypress
        if (event.keyCode == 38) {
            let selectedIndex = this.state.selectedIndex - 1;

            if (selectedIndex < 0) {
                selectedIndex = this.state.suggestions.length - 1;
            }

            this.setState({
                selectedIndex: selectedIndex
            });
        }

        // DOWN keypress
        if (event.keyCode == 40) {
            let selectedIndex = this.state.selectedIndex + 1;
            let suggestions = this.state.suggestions;

            if (selectedIndex >= suggestions.length) {
                selectedIndex = 0;
            }

            this.setState({
                selectedIndex: selectedIndex
            });
        }
    }

    onBlur() {
        this.setState({
            suggestions: []
        });
    }

    onAutoCompleteClick(tagTitle) {
        this.props.onTagAdded(tagTitle);

        this.setState({
            query: '',
            suggestions: []
        });
    }

    onTagUpdated(oldTag, newTagTitle, newTagColor) {
        this.props.onTagUpdated(oldTag, newTagTitle, newTagColor);
    }

    onTagRemoved(tag) {
        this.props.onTagRemoved(tag);
    }

    render() {
        let suggestionList = this.state.suggestions;
        let suggestions = null;

        if (suggestionList.length > 0) {
            suggestions = suggestionList.map((suggestion, index) => {
                let isActive = this.state.selectedIndex == index;

                return (
                    <li 
                        key={suggestion.title}
                        className={isActive ? css.active : css.li}
                        onMouseDown={this.onAutoCompleteClick.bind(this, suggestion.title)}>
                        {suggestion.title}
                    </li>
                );
            });

            suggestions = (
                <ul className={css.suggestions}>
                    {suggestions}
                </ul>
            );
        }

        let tags = this.props.tags.map((tag) => {
            return (
                <TagItem
                    key={tag.title}
                    tag={tag}
                    onTagUpdated={this.onTagUpdated}
                    onTagRemoved={this.onTagRemoved} />
            );
        });

        return (
            <div className={css.tags}>
                {tags}
                <div className={css.inputWrap}>
                    <input 
                        type="text"
                        className={css.input}
                        value={this.state.query}
                        onChange={this.onQueryChanged}
                        onKeyDown={this.onInputKeyDown}
                        onFocus={this.onQueryChanged}
                        onBlur={this.onBlur}
                        placeholder="새 태그 입력"
                        ref={(input) => this.input = input} />
                    {suggestions}
                </div>
            </div>
        );
    }
}

export default TagInputComponent;