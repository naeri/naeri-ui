import axios from 'axios';

import Settings from '../settings.js';

class UserModule {
    constructor() {
        this.user = null;
        this.loggedIn = false;
    }

    getCurrentUser() {
        let self = this;

        if (this.loggedIn) {
            return Promise.resolve().then(function() {
                return self.user;
            });
        } else {
            return this.updateStatus()
                .then(function() {
                    return self.user; 
                })
                .catch(function() {
                    return null;
                }); 
        }
    }

    getIsLoggedIn() {
        if (this.loggedIn) {
            return Promise.resolve().then(function() {
                return true;
            });
        }

        return this.updateStatus()
            .then(function(loggedIn) {
                return loggedIn;
            })
            .catch(function() {
                return false;
            });
    }

    login(username, password) {
        let self = this;

        return axios.post(`${Settings.host}/user/signin`, {
            username: username,
            password: password
        }).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }

            self.user = result.user;
            self.loggedIn = true;

            return self.user;
        });
    }

    logout() {
        let self = this;

        return axios.get(`${Settings.host}/user/signout`)
            .then(function(result) {
                if (result.data.error) {
                    return Promise.reject(error.message);
                }

                self.user = null;
                self.loggedIn = false;
            });
    }

    join(username, password) {
        let self = this;

        return axios.post(`${Settings.host}/user/signup`, {
            username: username,
            password: password
        }).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }
            
            self.user = result.user;
            self.loggedIn = true;

            return self.user;
        });
    }

    updateStatus() {
        let self = this;

        return axios.get(`${Settings.host}/user/status`)
            .then(function(result) {
                if (result.data.error) {
                    return Promise.reject(error.message)
                }

                if (result.data.user) {
                    self.user = result.data.user;
                    self.loggedIn = true;
                } else {
                    self.user = null;
                    self.loggedIn = false;
                }

                return self.loggedIn;
            });
    }
}

export default UserModule;