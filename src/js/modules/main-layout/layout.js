import React from 'react';
import ReactDOM from 'react-dom';

import css from './style.css';

class Layout extends React.Component {
    render() {
        const { header, headerRight, content } = this.props;

        return (
            <div>
                <header className={css.header}>
                    <div className={css.wrap}>
                        <a className={css.title}>
                            Kokoto
                        </a>

                        {header}

                        <div className={css.rightMenu}>
                            {headerRight}
                        </div>
                    </div>
                </header>
                {content}
            </div>
        );
    }
}

export default Layout;