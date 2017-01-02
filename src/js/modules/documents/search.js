import React from 'react';

import css from './style.css';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            selected: false
        };

        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.onSearchInputFocus = this.onSearchInputFocus.bind(this);
        this.onSearchInputBlur = this.onSearchInputBlur.bind(this);
    }

    onSearchTextChanged(event) {
        this.setState({
            searchText: event.target.value
        });
    }

    onSearchInputFocus() {
        this.setState({
            selected: true
        });
    }

    onSearchInputBlur() {
        this.setState({
            selected: false
        });
    }

    render() {
        return (
            <form className={this.state.selected ? css.selectedForm : css.searchForm}>
                <input 
                    type="text"
                    className={css.input}
                    value={this.state.searchText}
                    onChange={this.onSearchTextChanged}
                    onFocus={this.onSearchInputFocus}
                    onBlur={this.onSearchInputBlur}
                    placeholder="검색" />
                <i className={'fa fa-search ' + css.icon}></i>
            </form>
        );
    }
}

export default Search;