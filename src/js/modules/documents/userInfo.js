import React from 'react';

import css from './style.css';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }

    componentWillMount() {
        let self = this;

        this.props.loginModule
            .getCurrentUser()
            .then(function(user) {
                self.setState({
                    username: user.username 
                });
            });
    }

    render() {

        return (
            <div className={css.userInfo}>
                {this.state.username}
            </div>
        );
    }
}

export default UserInfo;