import React from 'react';
import { browserHistory } from 'react-router';
import path from 'path';

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

function getTranslation(translationKey) {
    const req = require.context('../intl', true, /js$/);
    let translation;
            
    try {
        translation = req('./' + translationKey + '/' + language + '.js').default;
    } catch (e) {
        language = 'en-us';
        translation = req('./' + translationKey + '/' + language + '.js').default;
    } finally {
        translation.lang = language.split('-')[0];                
    }

    return translation;
}

export default (routeTable, userModule) => {
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
            if (!route) {
                return;
            }

            let onEnter = undefined;
            if (route.authed !== undefined) {
                onEnter = route.authed ? requireAuth : requireNotAuth;
            }

            let indexRoute;
            for (let i in (route.routes || [])) {
                let _route = route.routes[i];

                if (_route.indexRoute) {
                    indexRoute = _route;
                    route.routes.splice(i, 1);
                    break;
                }
            }

            let component = undefined;
            if (route.component) {
                let { component: Component, translationKey } = route.component;

                component = (props) => (
                    <Component 
                        translation={getTranslation(translationKey)}
                        {...props} />
                );
            }

            Object.keys(route.components || {}).forEach((key) => {
                let { component: Component, translationKey } = route.components[key];

                route.components[key] = (props) => (
                    <Component
                        translation={getTranslation(translationKey)} 
                        {...props} />
                );
            });

            return {
                path: route.path,
                onEnter: onEnter,
                indexRoute: formatRoute(indexRoute),
                component: component,
                components: route.components,
                childRoutes: createRoute(route.routes),
                key: route.key
            }
        });
    }

    return {
        path: '/',
        childRoutes: createRoute(routeTable)
    };
};