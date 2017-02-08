import React from 'react';
import Parser from 'koto-parser';

import css from './style.css';

const CTRL = 'ctrl';
const SHIFT = 'shift';

function insertAndCreateRange(textarea, startStr, endStr, defaultValue) {
    const { value } = textarea;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    const start = value.substring(0, startPos);
    const middle = value.substring(startPos, endPos);
    const end = value.substring(endPos);

    let text = '';
    if (middle === '') {
        text = defaultValue;
    }

    textarea.value = start + startStr + middle + text + endStr + end;

    textarea.selectionStart = startPos + startStr.length;
    textarea.selectionEnd = endPos + startStr.length + text.length;
}

const Button = ({ icon: _icon, onClick, title }) => {
    let icon;

    if (_icon.text) {
        icon = _icon.text;
    } else {
        icon = <i className={`fa fa-${_icon.icon}`} />;
    }

    return (
        <div 
            className={css.button} 
            title={title}
            onClick={onClick}>
            {icon}
        </div>
    );
}

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parsedValue: props.value
        };                        

        this.buttons = [
            {
                icon: {
                    text: <b>B</b>
                },
                specialKeys: [ CTRL ],
                key: 'b',
                onClick: () => this.onInsert('**', '**', '굵게')
            },
            {
                icon: {
                    text: <i>i</i>
                },
                specialKeys: [ CTRL ],
                key: 'i',
                onClick: () => this.onInsert('*', '*', '기울여서')
            },
            {
                icon: {
                    text: <u>U</u>
                },
                specialKeys: [ CTRL ],
                key: 'u',
                onClick: () => this.onInsert('__', '__', '밑줄')
            },
            {
                icon: {
                    text: <strike>S</strike>
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 's',
                onClick: () => this.onInsert('~~', '~~', '취소선')
            },
            {
                separate: true
            },
            { 
                icon: {
                    icon: 'image'
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 'i',
                onClick: () => this.onInsert('![](', ')', '이미지 링크')
            },
            { 
                icon: {
                    icon: 'file-text-o'
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 'f',
                onClick: () => this.onInsert('#[](', ')', '파일 링크')
            },
            { 
                icon: {
                    icon: 'link'
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 'k',
                onClick: () => this.onInsert('[](', ')', '링크')
            },
            {
                separate: true
            },
            { 
                icon: {
                    text: 'H1'
                },
                specialKeys: [ CTRL ],
                key: 'h',
                onClick: () => this.onInsert('\n\n# ', '\n', '큰 제목')
            },
            { 
                icon: {
                    text: 'H2'
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 'h',
                onClick: () => this.onInsert('\n\n## ', '\n', '중간 제목')
            },
                { 
                icon: {
                    icon: 'quote-left'
                },
                specialKeys: [ CTRL ],
                key: 'q',
                onClick: () => this.onInsert('\n\n> ', '\n\n', '인용문')
            },
            { 
                icon: {
                    icon: 'list'
                },
                specialKeys: [ CTRL ],
                key: 'l',
                onClick: () => this.onInsert('\n\n* ', '\n\n', '순서 없는 목록')
            },
            { 
                icon: {
                    icon: 'list-ol'
                },
                specialKeys: [ CTRL, SHIFT ],
                key: 'l',
                onClick: () => this.onInsert('\n\n1. ', '\n\n', '순서 있는 목록')
            },
        ];

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    static contextTypes = {
        translation: React.PropTypes.object
    }

    componentDidMount() {
        this.updateParsedValue(this.props.value);
    }

    componentDidUpdate(prevProps) {
        let { value } = this.props;

        if (prevProps.value === value) {
            return;
        }

        this.updateParsedValue(value);
    }

    onKeyDown(event) {
        let { ctrlKey, shiftKey, keyCode, charCode } = event;

        this.buttons.every((button) => {
            if (button.separate) {
                return true;
            }

            if (button.specialKeys.includes(CTRL) && !ctrlKey) {
                return true;
            }

            if (button.specialKeys.includes(SHIFT) && !shiftKey) {
                return true;
            }

            let code = charCode || keyCode;
            let keyStr = String.fromCharCode(code);

            if (button.key !== keyStr.toLowerCase()) {
                return true;
            }

            button.onClick();
            event.preventDefault();
            return false;
        })
    }

    onInsert(startText, endText, tooltip) {
         const { textarea } = this;

        textarea.focus();
        insertAndCreateRange(textarea, startText, endText, tooltip);

        this.props.onChange({
            target: {
                value: textarea.value
            }
        });
    }

    updateParsedValue(value) {
        Parser.render(value, (error, result) => {
            if (error) {
                result = value;
            }

            this.setState({
                parsedValue: result
            });
        });
    }

    render() {
        const { value } = this.props;
        const { parsedValue } = this.state;
        const { translation } = this.context;

        const buttons = this.buttons.map((item, i) => {
            if (item.separate) {
                return <span key={i} className={css.sep} />;
            }

            const { specialKeys, key } = item;
            let title = '';

            if (specialKeys.includes(CTRL)) {
                title += 'Ctrl+'
            }

            if (specialKeys.includes(SHIFT)) {
                title += 'Shift+'
            }

            title += key.toUpperCase();

            return <Button key={i} icon={item.icon} onClick={item.onClick} title={title} />
        });

        return (
            <div className={css.wrap}>
                <div className={css.left}>
                    <div className={css.buttonTitle}>
                        <div className={css.menu}>
                            {buttons}
                        </div>
                        <div className={css.text}>
                            {translation.write}
                        </div>
                    </div>
                    <textarea
                        className={css.textarea}
                        value={value}
                        onKeyDown={this.onKeyDown}
                        onChange={(event) => this.props.onChange(event)}
                        ref={(textarea) => this.textarea = textarea}
                        placeholder={translation.whatContent} />
                </div>
                <div 
                    className={css.right}>
                    <div className={css.title}>
                        <div className={css.text}>
                            {translation.preview}
                        </div>
                    </div>
                    <div 
                        className={css.container}
                        dangerouslySetInnerHTML={{ __html: parsedValue }} />
                </div>
            </div>
        )
    }
}

export default Editor;