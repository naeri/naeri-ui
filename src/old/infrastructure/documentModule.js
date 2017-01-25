import axios from 'axios';

import Settings from '../settings.js';

class DocumentModule {
    getHasMoreDocuments(tagId) {
        if (this.lastTagId === tagId) {
            return this.hasMoreDocuments;
        }
        return true;
    }

    getDocuments(tagId, lastDocumentId) {
        let self = this;

        return axios.post(`${Settings.host}/document/search`, {
            tag: tagId,
            after: lastDocumentId
        }).then(function(result){
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }

            let documents = result.documents;
            let lastItem = documents.slice(-1)[0];

            if (lastItem) {
                self.lastDocumentId = lastItem._id;
            }

            return result.documents;
        });
    }

    addDocument(title, markdown, tags) {
        let self = this;

        return axios.post(`${Settings.host}/document/add`, {
            title: title,
            markdown: markdown,
            tags: tags
        }).then(function(result) {
            result = result.data;

            if (result.error) {
                return Promise.reject(result.error.message);
            }
        });
    }

    getDocument(documentId) {
        let self = this;

        return axios.get(`${Settings.host}/document/get/${documentId}`)
            .then(function(result) {
                result = result.data;

                if (result.error) {
                    return Promise.reject(result.error.message);
                }

                return result.document;
            });
    }

    addComment(documentId, tagInfo) {
        let self = this;

        return axios.post(`${Settings.host}/comment/add`, {
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