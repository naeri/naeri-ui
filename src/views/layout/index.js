import React from 'react';
import { Link } from 'react-router';
import UserInfo from './components/userInfo';

import css from './style.css';

const Layout = ({ header, content }) => (
    <div>
        <header className={css.header}>
            <div className={css.wrap}>
                <Link to="/" className={css.title}>
                    Kokoto
                </Link>

                {header}

                <div className={css.rightMenu}>
                    <UserInfo />
                </div>
            </div>
        </header>
        {content}
    </div>
);

export default Layout;