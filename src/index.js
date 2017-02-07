import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import routes from 'routes';

import UserModule from 'modules/user';
import TagModule from 'modules/tag';
import DocumentModule from 'modules/document';

const userModule = new UserModule();
const tagModule = new TagModule();
const documentModule = new DocumentModule();

class AppContainer extends React.Component {
    getChildContext() {
        return {
            userModule: userModule,
            tagModule: tagModule,
            documentModule: documentModule
        }
    }

    static childContextTypes = {
        userModule: React.PropTypes.object,
        tagModule: React.PropTypes.object,
        documentModule: React.PropTypes.object
    }

    render() {
        return <Router history={browserHistory} routes={routes(userModule)} />;
    }
}

render(<AppContainer />, document.getElementById('kokoto'));