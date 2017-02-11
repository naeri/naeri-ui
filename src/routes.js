import React from 'react';
import path from 'path';
import createRoute from 'utils/createRoute';

import Join from 'views/member/join';
import Login from 'views/member/login';

import Layout from 'views/layout';
import DocumentSearch from 'views/documentSearch';
import DocumentList from 'views/documentList';
import DocumentView from 'views/documentView';
import DocumentWrite from 'views/documentWrite';

const routeTable = [
    {
        path: '/join',
        authed: false,
        component:  {
            component: Join,
            translationKey: 'join'
        }
    },
    {
        path: '/login',
        authed: false,
        translationKey: 'login',
        component: {
            component: Login,
            translationKey: 'login'
        }
    },
    {
        authed: true,
        component: {
            component: Layout,
            translationKey: 'layout'
        },
        routes: [
            {
                indexRoute: true,
                authed: true,
                components: {
                    content: {
                        component: DocumentList,
                        translationKey: 'documentList'
                    }
                },
                key: 'documents'
            },
            {
                path: '/write',
                authed: true,
                components: {
                    content: {
                        component: DocumentWrite,
                        translationKey: 'documentWrite'
                    },
                },
                key: 'documents'
            },
            {
                path: '/edit/:documentId',
                authed: true,
                components: {
                    content: {
                        component: DocumentWrite,
                        translationKey: 'documentWrite'
                    }
                },
                key: 'documents'
            },
            {
                path: '/view/:documentId',
                authed: true,
                components: {
                    content: {
                        component: DocumentView,
                        translationKey: 'documentView'
                    },
                },
                key: 'documents'
            }
        ]
    }
];

export default (userModule) => {
    return createRoute(routeTable, userModule);
};