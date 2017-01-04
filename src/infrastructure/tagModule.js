import axios from 'axios';

import Settings from '../settings.js';

class TagModule {
    getTagList() {
        return axios.get(`${Settings.host}/tag/list`).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }

            return result.tags;
        });
    }
}

export default TagModule;