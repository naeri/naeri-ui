import React from 'react';
import Parser from 'koto-parser';

import css from './style.css';

const CTRL = 'ctrl';
const SHIFT = 'shift';

const buttons = [
    {
        icon: {
            text: <b>B</b>
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'b'
        },
        text: {
            leadingText: '**',
            trailingText: '**',
            defaultText: '굵게'
        }
    },
    {
        icon: {
            text: <i>i</i>
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'i'
        },
        text: {
            leadingText: '*',
            trailingText: '*',
            defaultText: '기울여서'
        }
    },
    {
        icon: {
            text: <u>U</u>
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'u'
        },
        text: {
            leadingText: '__',
            trailingText: '__',
            defaultText: '밑줄'
        }
    },
    {
        icon: {
            text: <strike>S</strike>
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 's'
        },
        text: {
            leadingText: '~~',
            trailingText: '~~',
            defaultText: '취소선'
        }
    },
    {
        separate: true
    },
    { 
        icon: {
            icon: 'image'
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 'i'
        },
        text: {
            leadingText: '![',
            trailingText: ']()',
            defaultText: '이미지 캡션'
        }
    },
    { 
        icon: {
            icon: 'file-text-o'
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 'f'
        },
        text: {
            leadingText: '#[',
            trailingText: ']()',
            defaultText: '파일 캡션'
        }
    },
    { 
        icon: {
            icon: 'link'
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 'k'
        },
        text: {
            leadingText: '[',
            trailingText: ']()',
            defaultText: '링크 내용'
        }
    },
    {
        separate: true
    },
    { 
        icon: {
            text: 'H1'
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'h'
        },
        text: {
            leadingText: '\n\n# ',
            trailingText: '\n',
            defaultText: '큰 제목'
        }
    },
    { 
        icon: {
            text: 'H2'
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 'h'
        },
        text: {
            leadingText: '\n\n## ',
            trailingText: '\n',
            defaultText: '중간 제목'
        }
    },
    { 
        icon: {
            icon: 'quote-left'
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'q'
        },
        text: {
            leadingText: '\n\n> ',
            trailingText: '\n\n',
            defaultText: '인용문'
        }
    },
    { 
        icon: {
            icon: 'list'
        },
        key: {
            specialKeys: [ CTRL ],
            key: 'l'
        },
        text: {
            leadingText: '\n\n* ',
            trailingText: '\n\n',
            defaultText: '순서 없는 목록'
        }
    },
    { 
        icon: {
            icon: 'list-ol'
        },
        key: {
            specialKeys: [ CTRL, SHIFT ],
            key: 'l'
        },
        text: {
            leadingText: '\n\n1. ',
            trailingText: '\n\n',
            defaultText: '순서 있는 목록'
        }
    }
];

function insertAndCreateRange(textarea, startStr, endStr, defaultValue) {
    const { value } = textarea;

    let startPos = textarea.selectionStart;
    let endPos = textarea.selectionEnd;
    
    let start = value.substring(0, startPos);
    let middle = value.substring(startPos, endPos);
    let end = value.substring(endPos);

    const removingMode = (start.slice(-startStr.length, ) === startStr) &&
                         (end.substring(0, endStr.length) === endStr);

    if (removingMode) {
        start = start.substring(0, start.length - startStr.length);
        startPos -= startStr.length;
        endPos -= startStr.length;

        end = end.substring(endStr.length);
    } else {
        start += startStr;
        startPos += startStr.length;
        endPos += startStr.length;

        end = endStr + end;
    }

    if (middle === '') {
        middle = defaultValue;
        endPos += defaultValue.length;
    }

    textarea.value = start + middle + end;

    textarea.selectionStart = startPos;
    textarea.selectionEnd = endPos;
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
            parsedValue: props.value,
            textareaHover: false,
            previewHover: false
        };                        

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    
    static contextTypes = {
        translation: React.PropTypes.object
    }

    componentWillMount() {
        this.buttons = buttons.map((button) => {
            if (button.separate) {
                return button;
            }

            const { leadingText, trailingText, defaultText } = button.text;

            return {
                icon: button.icon,
                key: button.key,
                onClick: () => this.onInsert(leadingText, trailingText, defaultText)
            }
        });
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

            const { key: buttonKey } = button;

            if ((buttonKey.specialKeys.includes(CTRL) && !ctrlKey) ||
                (!buttonKey.specialKeys.includes(CTRL) && ctrlKey)) {
                return true;
            }

            if ((buttonKey.specialKeys.includes(SHIFT) && !shiftKey) ||
                (!buttonKey.specialKeys.includes(SHIFT) && shiftKey)) {
                return true;
            }

            let code = charCode || keyCode;
            let keyStr = String.fromCharCode(code);

            if (buttonKey.key !== keyStr.toLowerCase()) {
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

    onScroll(event) {
        const { textareaHover, previewHover } = this.state;
        
        const { scrollTop, scrollHeight, offsetHeight } = event.target;
        const ratio = scrollTop / (scrollHeight - offsetHeight);

        if (textareaHover) {
            this.preview.scrollTop = (this.preview.scrollHeight - this.preview.offsetHeight) * ratio;
        } else {
            this.textarea.scrollTop = (this.textarea.scrollHeight - this.textarea.offsetHeight) * ratio;
        }
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

        const buttons = this.buttons.map((button, i) => {
            if (button.separate) {
                return <span key={i} className={css.sep} />;
            }

            const { specialKeys, key } = button.key;
            let title = '';

            if (specialKeys.includes(CTRL)) {
                title += 'Ctrl+'
            }

            if (specialKeys.includes(SHIFT)) {
                title += 'Shift+'
            }

            title += key.toUpperCase();

            return <Button key={i} icon={button.icon} onClick={button.onClick} title={title} />;
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
                        onMouseEnter={(event) => this.setState({ textareaHover: true })}
                        onMouseLeave={(event) => this.setState({ textareaHover: false })}
                        onScroll={this.onScroll}
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
                        dangerouslySetInnerHTML={{ __html: parsedValue }}
                        onMouseEnter={(event) => this.setState({ previewHover: true })}
                        onMouseLeave={(event) => this.setState({ previewHover: false })}
                        onScroll={this.onScroll} 
                        ref={(container) => this.preview = container}/>
                </div>
            </div>
        )
    }
}

export default Editor;