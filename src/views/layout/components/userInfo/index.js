import React from 'react';
import { browserHistory } from 'react-router';

import Spinner from 'components/spinner';

import Settings from 'settings';
import css from './style.css';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: false
        };
    }

    static contextTypes = {
        userModule: React.PropTypes.object,
        translation: React.PropTypes.object
    };

    async componentWillMount() {
        let self = this;

        this.setState({
            loading: true
        });

        let user = await this.context.userModule.getCurrentUser();
        
        self.setState({
            user: user,
            loading: false
        });
    }

    render() {
        const { translation } = this.context;
        const { user } = this.state;

        let username = (() => {
            if (this.state.loading) {
                return (
                    <Spinner innerStyle={{ width: '30px', height: '30px' }} color="#a0a0a0" />
                );
            }
            
            return (
                <div>
                    <div className={css.title}>
                        <img 
                            src={`${Settings.host}/user/${this.state.user.id}/picture`} 
                            className={css.image}/>
                        <div className={css.id}>
                            <div className={css.name}>
                                {user.name}
                            </div>
                            <div className={css.small}>
                                @{user.id}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })();

        return (
            <div className={css.userInfo}>
                {username}
            </div>
        )
    }
}

export default UserInfo;