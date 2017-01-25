import React from 'react';
import path from 'path';
import createRoute from 'utils/createRoute';

import Join from 'views/member/join';
import Login from 'views/member/login';

import Layout from 'views/layout';
import DocumentSearch from 'views/documentSearch';
import DocumentList from 'views/documentList';
import DocumentView from 'views/documentView';

const routeTable = [
    {
        path: '/',
        authed: false,
        translationKey: 'join',
        component: Join
    },
    {
        path: '/login',
        authed: false,
        translationKey: 'login',
        component: Login
    },
    {
        authed: true,
        translationKey: 'layout',
        component: Layout,
        routes: [
            {
                indexRoute: true,
                translationKey: 'documentList',
                components: {
                    header: DocumentSearch,
                    content: DocumentList
                }
            },
            {
                path: '/view/:documentId',
                translationKey: 'documentView',
                components: {
                    content: DocumentView
                }
            }
        ]
    }
];

export default (userModule) => {
    return createRoute(routeTable, userModule);
};