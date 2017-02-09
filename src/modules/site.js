import axios from 'axios';

import Settings from 'settings';

class SiteModule {
    async getSiteName() {
        try {
            const { data: result } = await axios.get(`${Settings.host}/site/name`);

            return result.result;
        } catch (e) {
            return e.response.data.error;
        }
    }
}

export default SiteModule;