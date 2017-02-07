import React from 'react';

import css from './style.css';

const Button = (props) => {
    let { 
        className,
        content,
        refFunc,
        pseudo,
        width,
        onClick
    } = props;

    return (
        <button
            className={className + ' ' + (pseudo ? css.pseudo : '')}
            onClick={onClick}
            style={{ overflow: 'hidden', width: width }}
            ref={refFunc}>
            {content}
        </button>
    );
}

class ResizeAnimationButton extends React.Component {
    constructor() {
        super();
    }
    
    render() {
        const { 
            className,
            submittingClassName,
            content,
            submittingContent,
            submitting,
            onClick
        } = this.props;

        let width = undefined;
        let submittingWidth = undefined;

        if (this.submitBtn && this.submittingBtn) {
            width = this.submitBtn.offsetWidth;
            submittingWidth = this.submittingBtn.offsetWidth;
        }

        return (
            <div className={css.wrap}>
                <Button
                    className={submittingClassName}
                    content={submittingContent}
                    pseudo={true}
                    refFunc={(input) => this.submittingBtn = input} />
                <Button
                    className={className}
                    content={content}
                    pseudo={true}
                    refFunc={(input) => this.submitBtn = input} />
                <Button
                    className={submitting ? submittingClassName : className}
                    content={submitting ? submittingContent : content}
                    width={submitting ? submittingWidth : width}
                    onClick={onClick} />
            </div>
        );
    }
}

export default ResizeAnimationButton;