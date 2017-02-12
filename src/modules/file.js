import axios from 'axios';

import Settings from 'settings';

class FileModule {
    async getFiles(tagId, lastFileId) {
        const params = {
            after: lastFileId
        };

        if (tagId === null) {
            params.type = 'date';
        } else {
            params.type = 'tag';
            params.query = tagId;
        }

        try {
            const { data: result } = await axios.get(`${Settings.host}/file/search`, {
                params: params
            })

            return result.files;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async addFile(title, content, tags, file) {
        try {
            const data = new FormData();
            data.append('title', title);
            data.append('content', content);
            data.append('tags', JSON.stringify(tags));
            data.append('stream', file);

            const { data: result } = await axios.post(`${Settings.host}/file`, data, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });

            return result.file;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async getFile(fileId) {
        if (!fileId) {
            return {};
        }

        try {
            const { data: result } = await axios.get(`${Settings.host}/file/${fileId}`);

            return result.file;
        } catch (e) {
            throw e.response.data.error;
        }
    }
}

export default FileModule;