import React from 'react';
import { Link } from 'react-router';
import UserInfo from './components/userInfo';

import css from './style.css';

const MenuBtn = ({ link, title, iconId }) => (
    <Link to={link} className={css.menuBtn}>
        <i className={`fa fa-${iconId}`} />
        {' '}
        {title}
    </Link>
);

const Layout = ({ header, content }) => (
    <div>
        <header className={css.header}>
            <div className={css.top}>
                <div className={css.leftMenu}>
                    <MenuBtn link="/" title="게시글" iconId="newspaper-o" />
                    <MenuBtn link="/" title="파일" iconId="file-text" />
                    <MenuBtn link="/" title="사람들" iconId="users" />
                </div>

                <Link to="/" className={css.title}>
                    <img src="/images/kokoto.png" className={css.img}/>
                </Link>

                <div className={css.rightMenu}>
                    <UserInfo />
                </div>
            </div>
        </header>
        {content}
    </div>
);

            // <div className={css.bottom}>
            //    {header}
            // </div>

export default Layout;