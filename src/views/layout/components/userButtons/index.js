import React from 'react';
import { browserHistory } from 'react-router';

import Spinner from 'components/spinner';

import css from './style.css';

class UserButtons extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false
        };

        this.logout = this.logout.bind(this);
    }

    static contextTypes = {
        userModule: React.PropTypes.object,
        translation: React.PropTypes.object
    };

    async componentWillMount() {
        this.setState({
            loading: true
        });

        let user = await this.context.userModule.getCurrentUser();
        
        this.setState({
            loading: false
        });
    }
    
    async logout() {
        await this.context.userModule.logout();
        browserHistory.push('/login');
    }

    render() {
        const { translation } = this.context;

        const content = (() => {
            if (this.state.loading) {
                return <Spinner 
                            innerStyle={{ width: '30px', height: '30px' }}
                            color="#a0a0a0"
                            align="right" />
            }

            return (
                <div>
                    <a className={css.item}>
                        <i className="fa fa-cog" />
                        {' '}
                        {translation.settings}
                    </a>
                    <a className={css.item} onClick={this.logout}>
                        <i className="fa fa-sign-out" />
                        {' '}
                        {translation.logout}
                    </a>
                </div>
            );
        })();

        return (
            <div className={css.wrap}>
                {content}
            </div>
        );
    }
}

export default UserButtons;