import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import axios from 'axios';

import Settings from '../../settings.js';
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

    onFormSubmit(event) {
        event.preventDefault();

        this.setState({
            submitting: true
        });

        const userModule = this.props.userModule;
        const username = this.state.username;
        const password = this.state.password;
        let self = this;

        userModule
            .login(username, password)
            .then(function() {
                browserHistory.push('/');
            })
            .catch(function(message) {
                self.setState({
                    error: message,
                    password: '',
                    submitting: false
                });
            });
    }

    render() {
        let error = this.state.error ? (
            <div className={css.error}>
                {this.state.error}
            </div>
        ) : null;

        return (
            <div className={css.wrap}>
                <div>
                    <form 
                        className={css.modal}
                        onSubmit={this.onFormSubmit}>
                        <div className={css.title}>
                            Kokoto
                        </div>
                        {error}
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={this.onUsernameChanged}
                            placeholder="아이디"
                            className={css.username} />
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.onPasswordChanged}
                            placeholder="비밀번호"
                            className={css.password}
                            ref={(input) => this.passwordInput = input} />
                        <button
                            type="submit"
                            className={ this.state.submitting ? css.submitting : css.submit }>
                            { this.state.submitting ? '로그인 중..' : '로그인' }
                        </button>
                    </form>
                    <a
                        href="./join"
                        className={css.link}>
                        계정이 없으세요? <b>회원 가입</b>
                    </a>
                </div>
            </div>
        );
    }
}

export default Login;