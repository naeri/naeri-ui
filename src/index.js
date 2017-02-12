import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import routes from 'routes';

import UserModule from 'modules/user';
import TagModule from 'modules/tag';
import DocumentModule from 'modules/document';
import SiteModule from 'modules/site';
import FileModule from 'modules/file';

import 'commonCss/file.css';

const userModule = new UserModule();
const tagModule = new TagModule();
const documentModule = new DocumentModule();
const siteModule = new SiteModule();
const fileModule = new FileModule();

class AppContainer extends React.Component {
    getChildContext() {
        return {
            userModule: userModule,
            tagModule: tagModule,
            documentModule: documentModule,
            siteModule: siteModule,
            fileModule: fileModule
        }
    }

    static childContextTypes = {
        userModule: React.PropTypes.object,
        tagModule: React.PropTypes.object,
        documentModule: React.PropTypes.object,
        siteModule: React.PropTypes.object,
        fileModule: React.PropTypes.object
    }

    render() {
        return <Router history={browserHistory} routes={routes(userModule)} />;
    }
}

render(<AppContainer />, document.getElementById('kokoto'));