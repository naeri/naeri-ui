import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import UserModule from './infrastructure/userModule';
import DocumentModule from './infrastructure/documentModule';
import TagModule from './infrastructure/tagModule';

import Documents from './modules/documents/documents';
import DocumentSearch from './modules/documents/search';
import UserInfo from './modules/documents/userInfo';
import Layout from './modules/main-layout/layout';
import Login from './modules/modal/login';
import Join from './modules/modal/join';

const userModule = new UserModule();
const tagModule = new TagModule();
const documentModule = new DocumentModule();

function requireAuth(nextState, replace) {
    return userModule
        .getIsLoggedIn()
        .then(function(loggedIn) {
            if (!loggedIn) {
                browserHistory.push('/login');
            }
        });
}

function requireNotAuth(nextState, replace) {
    return userModule
        .getIsLoggedIn()
        .then(function(loggedIn) {
            if (loggedIn) {
                browserHistory.push('/');
            }
        });
}

render((
    <Router history={browserHistory}>
        <Route path="/">
            <Route component={Layout} onEnter={requireAuth}>
                <IndexRoute components={{ 
                    header: DocumentSearch,
                    headerRight: () => { return <UserInfo loginModule={userModule} /> },
                    content: () => { return <Documents tagModule={tagModule} documentModule={documentModule} /> }
                }} />
            </Route>
            <Route onEnter={requireNotAuth}>
                <Route path="/join" component={
                    () => { return <Join userModule={userModule} /> }
                } />
                <Route path="/login" component={
                    () => { return <Login userModule={userModule} /> }
                } />
            </Route>
        </Route>
    </Router>
), document.getElementById("kokoto"));