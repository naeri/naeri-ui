import axios from 'axios';

import Settings from '../settings.js';

class UserModule {
    constructor() {
        this.user = null;
        this.isLoggedIn = false;
    }

    async getCurrentUser() {
        if (this.loggedIn) {
            return this.user;
        } else {
            return await this.updateStatus();
        }
    }

    async getIsLoggedIn() {
        if (this.loggedIn) {
            return true;
        }

        return await this.updateStatus();
    }

    async login(username, password) {
        try {
            let { data: result } = await axios.put(`${Settings.host}/session`, {
                username: username,
                password: password
            });

            this.user = result.user;
            this.isLoggedIn = true;

            return this.user;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async logout() {
        try {
            let { data: result } = await axios.delete(`${Settings.host}/session`)

            this.user = null;
            this.isLoggedIn = false;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async join(username, password) {
        try {
            let { data: result } = await axios.post(`${Settings.host}/user`, {
                username: username,
                password: password
            });
            
            this.user = result.user;
            this.isLoggedIn = true;

            return this.user;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async updateStatus() {
        try {
            let { data: result } = await axios.get(`${Settings.host}/user/me`);

            if (result.user) {
                this.user = result.user;
                this.isLoggedIn = true;
            } else {
                this.user = null;
                this.isLoggedIn = false;
            }

            return this.isLoggedIn;
        } catch (e) {
            return false;
        }
    }
}

export default UserModule;