import React from 'react';
import { browserHistory } from 'react-router';
import path from 'path';

export default (routeTable, userModule) => {
    let language;

    if (navigator.language) {
        language = navigator.language.toLowerCase();
    }

    if (navigator.browserLanguage) {
        language = navigator.browserLanguage.toLowerCase();
    }

    if (navigator.languages) {
        language = navigator.languages[0].toLowerCase();
    }

    const requireAuth = async () => {
        let loggedIn = await userModule.getIsLoggedIn();

        if (!loggedIn) {
            browserHistory.push('/login');
        }
    }

    const requireNotAuth = async () => {
        let loggedIn = await userModule.getIsLoggedIn();

        if (loggedIn) {
            browserHistory.push('/');
        }
    }

    const createRoute = (table) => {
        if (!table) {
            return;
        }

        return table.map(function formatRoute(route) {
            let onEnter = null;
            if (route.authed !== null) {
                onEnter = route.authed ? requireAuth : requireNotAuth;
            }

            const req = require.context('../intl', true, /js$/);
            let translation;
            
            try {
                translation = req('./' + route.translationKey + '/' + language + '.js').default;
            } catch (e) { 
                translation = req('./' + route.translationKey + '/' + 'en-us' + '.js').default
            }

            Object.keys(route.components || {}).forEach((key) => {
                let Component = route.components[key];

                route.components[key] = (props) => (
                    <Component
                        translation={translation} 
                        {...props} />
                );
            });

            let indexRoute;
            for (let i in (route.routes || [])) {
                let _route = route.routes[i];

                if (_route.indexRoute) {
                    indexRoute = _route;
                    route.routes.splice(i, 1);
                    break;
                }
            }

            return {
                path: route.path,
                onEnter: onEnter || undefined,
                indexRoute: indexRoute ? formatRoute(indexRoute) : undefined,
                component: route.component ? (props) => (
                    <route.component 
                        translation={translation} 
                        {...props} />
                ) : undefined,
                components: route.components,
                childRoutes: createRoute(route.routes)
            }
        });
    }

    return {
        path: '/',
        childRoutes: createRoute(routeTable)
    };
};