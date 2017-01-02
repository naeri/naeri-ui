import React from 'react';

import Spinner from '../../components/spinner/component';

import Settings from '../../settings.js';
import css from './style.css';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            username: null,
            loading: false
        };
    }

    componentWillMount() {
        let self = this;

        this.setState({
            loading: true
        });

        this.props.userModule
            .getCurrentUser()
            .then(function(user) {
                self.setState({
                    id: user._id,
                    username: user.username,
                    loading: false
                });
            });
    }

    render() {
        let username = (() => {
            if (this.state.loading) {
                return (
                    <Spinner style={{ height: '50px' }} innerStyle={{ width: '20px', height: '20px' }} />
                );
            } else {
                return (
                    <div className={css.userInfo}>
                        <img 
                            src={`${Settings.host}/user/picture/${this.state.id}`} 
                            className={css.image}/>
                        {this.state.username}
                    </div>
                );
            }
        })();

        return username;
    }
}

export default UserInfo;