/**
 * Azure Storage Blob SAS Generate
 */

const { BaseRequestPolicy } = require("@azure/storage-blob");
const { showToast } = require('./toast');

const sasApiUrl = process.env.SAS_API_URL;
const linkGenerateApiUrl = process.env.LINK_GENERATE_API_URL;
const CsrfParam = document.getElementById("CsrfParam").value;

const axios = require('axios');
axios.defaults.headers.common['X-CSRF-TOKEN'] = CsrfParam;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const ContainerName = async () => {
    return await axios.post(sasApiUrl, { container_name: true })
        .then(response => response.data.container)
        .catch((error) => { throw Error(error) });
};

export { ContainerName, linkGenerateApiUrl, axios };

export class SasStore {
    constructor() {
        this.sasCache = {};
    }

    // Get a valid SAS for blob
    async getValidSASForBlob(blobURL) {
        if (this.sasCache[blobURL] && this.isSasStillValidInNext2Mins(this.sasCache[blobURL])) {
            return this.sasCache[blobURL];
        } else {
            return (this.sasCache[blobURL] = await this.getNewSasForBlob(blobURL));
        }
    }

    // Return true if "se" section in SAS is still valid in next 2 mins
    isSasStillValidInNext2Mins(sas) {
        const expiryStringInSas = new URL(`http://hostname${sas}`).searchParams.get("se");
        return new Date(expiryStringInSas) - new Date() >= 2 * 60 * 1000;
    }

    // Get a new SAS for blob, we assume a SAS starts with a "?"
    async getNewSasForBlob(blobURL) {
        return axios.post(sasApiUrl, {/* data */ })
            .then((response) => response.data.token)
            .catch((error) => {
                console.error(error);
                return '';
            });
    }
}

export class SasUpdatePolicyFactory {
    constructor(sasStore) {
        this.sasStore = sasStore;
    }
    create(nextPolicy, options) {
        return new SasUpdatePolicy(nextPolicy, options, this.sasStore);
    }
}

export class SasUpdatePolicy extends BaseRequestPolicy {
    constructor(nextPolicy, options, sasStore) {
        super(nextPolicy, options);
        this.sasStore = sasStore;
    }

    async sendRequest(request) {
        const urlObj = new URL(request.url);
        const sas = await this.sasStore.getValidSASForBlob(`${urlObj.origin}${urlObj.pathname}`);
        new URL(`http://hostname${sas}`).searchParams.forEach((value, key) => {
            urlObj.searchParams.set(key, value);
        });

        // Update request URL with latest SAS
        request.url = urlObj.toString();

        return this._nextPolicy.sendRequest(request);
    }
}
