import axios from 'axios';

import Settings from 'settings';

class TagModule {
    async getTagList() {
        try {
            let { data: result } = await axios.get(`${Settings.host}/tag/search`);

            return result.tags;
        } catch (e) {
            return e.response.data.error;
        }
    }
}

export default TagModule;