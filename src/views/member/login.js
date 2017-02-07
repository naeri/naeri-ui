import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import axios from 'axios';

import css from './style.css';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: '',
            submitting: false
        }

        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onUsernameChanged(event) {
        this.setState({
            username: event.target.value
        });
    }

    onPasswordChanged(event) {
        this.setState({
            password: event.target.value
        })
    }

    async onFormSubmit(event) {
        event.preventDefault();

        this.setState({
            submitting: true
        });

        const userModule = this.context.userModule;
        const username = this.state.username;
        const password = this.state.password;
        let self = this;

        try {
            await userModule.login(username, password);
            browserHistory.push('/');
        } catch ({ message }) {
            self.setState({
                error: message,
                password: '',
                submitting: false
            });
        }
    }

    render() {
        const { translation } = this.props;

        let error = this.state.error ? (
            <div className={css.error}>
                {this.state.error}
            </div>
        ) : null;

        return (
            <div className={css.flex}>
                <div className={css.wrap}>
                    <div className={css.left}>
                        <h1 className={css.featured}>
                            {translation.welcome}
                        </h1>
                        <footer className={css.leftFooter}>
                            <a
                                href="./join"
                                className={css.link}>
                                {translation.noAccount} <b>{translation.join}</b>
                            </a> 
                        </footer>
                    </div>
                    <form 
                        className={css.right}
                        onSubmit={this.onFormSubmit}>
                        <div className={css.title}>
                            {translation.login}
                        </div>
                        {error}
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={this.onUsernameChanged}
                            placeholder={translation.id}
                            className={css.username} />
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.onPasswordChanged}
                            placeholder={translation.password}
                            className={css.password}
                            ref={(input) => this.passwordInput = input} />
                        <button
                            type="submit"
                            className={ this.state.submitting ? css.submitting : css.submit }>
                            { this.state.submitting ? translation.loggingIn : translation.login }
                        </button>
                    </form>
                </div>  
            </div>
        );
    }
}

Login.contextTypes = {
    userModule: React.PropTypes.object
}

export default Login;