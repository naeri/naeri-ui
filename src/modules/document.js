import axios from 'axios';

import Settings from 'settings';

class DocumentModule {
    getHasMoreDocuments(tagId) {
        if (this.lastTagId === tagId) {
            return this.hasMoreDocuments;
        }
        return true;
    }

    async getDocuments(tagId, lastDocumentId) {
        let self = this;
        let params = {
            after: lastDocumentId
        };

        if (tagId === null) {
            params.type = 'date';
        } else {
            params.type = 'tag';
            params.query = tagId;
        }

        try {
            let { data: result } = await axios.get(`${Settings.host}/document/search`, {
                params: params
            })

            return result.documents;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async addDocument(title, content, tags) {
        try {
            const { data: result } = await axios.post(`${Settings.host}/document`, {
                title: title,
                content: content,
                tags: tags
            });

            return result.document.id;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async editDocument(documentId, title, content, tags) {
        try {
            const { data: result } = await axios.put(`${Settings.host}/document/${documentId}`, {
                title: title,
                content: content,
                tags: tags
            });

            return result.document.id;
        } catch (e) {
            throw e.response.data.error;
        }
    }

    async getDocument(documentId) {
        if (!documentId) {
            return {};
        }

        try {
            const { data: result } = await axios.get(`${Settings.host}/document/${documentId}`);

            return result.document;
        } catch (e) {
            return e.response.result.error;
        }
    }

    async addComment(documentId, tagInfo) {
        let self = this;

        return await axios.post(`${Settings.host}/comment/add`, {
            documentId: documentId,
            content: tagInfo.comment,
            range: tagInfo.selectionInfo
        }).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }
        });
    }
}

export default DocumentModule;