import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import axios from 'axios';

import css from './style.css';

class Join extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            name: '',
            password: '',
            submitting: false
        }

        this.onIdChanged = this.onIdChanged.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onIdChanged(event) {
        this.setState({
            id: event.target.value
        });
    }

    onNameChanged(event) {
        this.setState({
            name: event.target.value
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
        const { id, name, password } = this.state;
        let self = this;

        try {
            await userModule.join(id, name, password);
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
                                href="./login"
                                className={css.link}>
                                {translation.goBack}
                            </a> 
                        </footer>
                    </div>
                    <form 
                        className={css.right}
                        onSubmit={this.onFormSubmit}>
                         <div className={css.title}>
                            {translation.join}
                        </div>
                        {error}
                        <input
                            type="text"
                            value={this.state.id}
                            onChange={this.onIdChanged}
                            placeholder={translation.id}
                            className={css.username} />
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.onNameChanged}
                            placeholder={translation.name}
                            className={css.input} />
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
                </div>  
            </div>
        );
    }
}

Join.contextTypes = {
    userModule: React.PropTypes.object
}

export default Join;