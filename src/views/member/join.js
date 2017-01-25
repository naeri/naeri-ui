import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import axios from 'axios';

import css from './style.css';

class Join extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
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
            await userModule.join(username, password);
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
            <div className={css.wrap}>
                <div>
                    <form 
                        className={css.modal}
                        onSubmit={this.onFormSubmit}>
                        <div className={css.title}>
                            {translation.join}
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
                            { this.state.submitting ? translation.joining : translation.join }
                        </button>
                    </form>
                    <a
                        href="./login"
                        className={css.link}>
                        {translation.goBack}
                    </a>
                </div>
            </div>
        );
    }
}

Join.contextTypes = {
    userModule: React.PropTypes.object
}

export default Join;