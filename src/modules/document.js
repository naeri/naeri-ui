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
            throw e.response.result.error;
        }
    }

    async deleteDocument(documentId) {
        try {
            await axios.delete(`${Settings.host}/document/${documentId}`);
        } catch (e) {
            throw e.response.result.error;
        }
    }

    async addComment(documentId, comment, selectionInfo) {
        try {
            await axios.post(`${Settings.host}/comment`, {
                documentId: documentId,
                content: comment,
                range: selectionInfo
            });
        } catch (e) {
            throw e.response.result.error;
        }
    }

    async editComment(commentId, content) {
        try {
            await axios.put(`${Settings.host}/comment/${commentId}`, {
                content: content
            });
        } catch (e) {
            throw e.response.result.error;
        }
    }
}

export default DocumentModule;