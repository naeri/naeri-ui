import React from 'react';
import { browserHistory } from 'react-router';

import Spinner from 'components/spinner';

import Settings from 'settings';
import css from './style.css';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            username: null,
            loading: false
        };

        this.logout = this.logout.bind(this);
    }

    async componentWillMount() {
        let self = this;

        this.setState({
            loading: true
        });

        let { id, username } = await this.context.userModule.getCurrentUser();
        
        self.setState({
            id: id,
            username: username,
            loading: false
        });
    }

    async logout() {
        await this.context.userModule.logout();
        browserHistory.push('/login');
    }

    render() {
        let username = (() => {
            if (this.state.loading) {
                return (
                    <Spinner style={{ height: '50px' }} innerStyle={{ width: '20px', height: '20px' }} />
                );
            } else {
                return (
                    <div className={css.userInfo} onClick={this.logout}>
                        <div className={css.item}>
                            <img 
                                src={`${Settings.host}/user/${this.state.id}/picture`} 
                                className={css.image}/>
                            {this.state.username}
                        </div>
                        <div className={css.item}>
                            <i className="fa fa-sign-out" />
                            {' '}
                            로그아웃
                        </div>
                    </div>
                );
            }
        })();

        return username;
    }
}

UserInfo.contextTypes = {
    userModule: React.PropTypes.object
}

export default UserInfo;