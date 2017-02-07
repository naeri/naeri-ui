import React from 'react';
import { BlockPicker as ColorPicker } from 'react-color';

import Settings from 'settings';

import css from './style.css';

class TagItem extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            showModal: false,
            tagTitle: this.props.tag.title,
            tagColor: this.props.tag.color
        }

        this.onTitleClick = this.onTitleClick.bind(this);
        this.onTagRemoved = this.onTagRemoved.bind(this);
        this.onModalCloseClick = this.onModalCloseClick.bind(this);
        this.onTagTitleChanged = this.onTagTitleChanged.bind(this);
        this.onTagColorChanged = this.onTagColorChanged.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onTitleClick() {
        this.setState({
            showModal: true
        });
    }

    onModalCloseClick() {
        this.setState({
            showModal: false
        })
    }

    onTagRemoved(tag) {
        this.props.onTagRemoved(tag);
    }

    onFormSubmit(event) {
        this.props.onTagUpdated(this.props.tag, this.state.tagTitle, this.state.tagColor);

        this.setState({
            showModal: false
        });
    }

    onTagTitleChanged(event) {
        this.setState({
            tagTitle: event.target.value
        });
    }

    onTagColorChanged(color) {
        this.setState({
            tagColor: color.hex
        });
    }

    render() {
        const { translation } = this.context;

        return (
            <div className={css.wrap}>
                <div
                    style={{ backgroundColor: this.props.tag.color }}
                    className={css.tagItem}>
                    <span 
                        className={css.title}
                        onClick={this.onTitleClick}>
                        {this.props.tag.title}
                    </span>
                    <span 
                        className={css.removeBtn}
                        onClick={this.onTagRemoved.bind(this, this.props.tag)}>
                        &times;
                    </span>
                </div>
                <div className={this.state.showModal ? css.modalWrap : css.modalWrapHidden}>
                    <div className={css.modal}>
                        <div className={css.modalTitle}>
                            {translation.editTag}
                            <span 
                                className={css.close}
                                onClick={this.onModalCloseClick}>
                                &times;
                            </span>
                        </div>
                        <label 
                            htmlFor="tagName"
                            className={css.label}>
                            {translation.tagName}
                        </label>
                        <input 
                            type="text"
                            id="tagName"
                            className={css.input}
                            value={this.state.tagTitle}
                            onChange={this.onTagTitleChanged} />
                        <label className={css.label}>
                            {translation.tagColor}
                        </label>
                        <ColorPicker 
                            width="100%"
                            color={this.state.tagColor}
                            colors={Settings.colors}
                            onChange={this.onTagColorChanged}
                            triangle="hide" />
                        <button 
                            className={css.button}
                            onClick={this.onFormSubmit}>
                            {translation.edit}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

TagItem.contextTypes = {
    translation: React.PropTypes.object
}

export default TagItem;