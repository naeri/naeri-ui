import axios from 'axios';

import Settings from 'settings';

class UserModule {
    constructor() {
        this.user = null;
        this.isLoggedIn = false;
    }

    async getCurrentUser() {
        if (this.loggedIn) {
            return this.user;
        } else {
            await this.updateStatus();
            return this.user;
        }
    }

    async getIsLoggedIn() {
        if (this.loggedIn) {
            return true;
        }

        return await this.updateStatus();
    }

    async login(id, password) {
        try {
            let { data: result } = await axios.put(`${Settings.host}/session`, {
                id: id,
                password: password
            });

            this.user = result.user;
            this.isLoggedIn = true;

            return this.user;
        } catch (e) {
            if (e.response.data) {
                throw e.response.data.error;
            } else {
                throw new Error('');
            }
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

    async join(id, name, password) {
        try {
            let { data: result } = await axios.post(`${Settings.host}/user`, {
                id: id,
                name: name,
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