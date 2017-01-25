import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import css from './style.css';

class Layout extends React.Component {
    render() {
        const { header, headerRight, content } = this.props;

        return (
            <div>
                <header className={css.header}>
                    <div className={css.wrap}>
                        <Link to="/" className={css.title}>
                            Kokoto
                        </Link>

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