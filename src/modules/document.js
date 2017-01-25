import axios from 'axios';

import Settings from '../settings.js';

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
        let self = this;

        return await axios.post(`${Settings.host}/document`, {
            title: title,
            content: content,
            tags: tags
        }).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }
        });
    }

    async getDocument(documentId) {
        let self = this;

        return await axios.get(`${Settings.host}/document/${documentId}`)
            .then(function(result) {
                result = result.data;

                if (result.error) {
                    return Promise.reject(result.error.message);
                }

                return result.document;
            });
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