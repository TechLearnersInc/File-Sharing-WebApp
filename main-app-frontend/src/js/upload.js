/**
 * Modules
 */

const { v4: uuidv4 } = require('uuid');
const base64 = require('base-64');
const utf8 = require('utf8');
const { showToast } = require('./toast');
const storageURL = process.env.AZURE_STOARGE_ACCOUNT_URL;

const {
    SasStore,
    SasUpdatePolicyFactory,
    ContainerName,
    linkGenerateApiUrl,
    axios
} = require('./sas');

const {
    BlockBlobClient,
    AnonymousCredential,
    newPipeline
} = require("@azure/storage-blob");

const sasStore = new SasStore();
const pipeline = newPipeline(new AnonymousCredential());

// Inject SAS update policy factory into current pipeline
pipeline.factories.unshift(new SasUpdatePolicyFactory(sasStore));

/**
 * Variables
 */

const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");

const maxAllowedSize = 100 * 1024 * 1024; //100MB

/**
 * Functions
 */

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    //   console.log("dropped", e.dataTransfer.files[0].name);
    const files = e.dataTransfer.files;
    if (files.length === 1) {
        if (files[0].size < maxAllowedSize) {
            fileInput.files = files;
            uploadFile();
        } else {
            showToast(`Max file size is ${parseInt(maxAllowedSize / (1024 * 1024))}MB`);
        }
    } else if (files.length > 1) {
        showToast("You can't upload multiple files");
    }
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");

    // console.log("dropping file");
});

dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged");

    console.log("drag ended");
});

// file input change and uploader
fileInput.addEventListener("change", async () => {
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast(`Max file size is ${parseInt(maxAllowedSize / (1024 * 1024))}MB`);
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile();
});

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
    fileURL.select();
});

const uploadFile = async () => {
    console.log("file added uploading");
    const file = fileInput.files[0];
    const fileSize = file.size;
    let url, containerName;
    const fileName = `${file.name.toString()}-${base64.encode(utf8.encode(uuidv4()))}`;
    await ContainerName().then((response) => {
        url = `${storageURL}${response}/${fileName}`;
        containerName = response;
    });

    const blockBlobClient = new BlockBlobClient(
        `${url}${await sasStore.getValidSASForBlob(url)}`, // A SAS should start with "?"
        pipeline
    );

    // show the uploader
    progressContainer.style.display = "block";

    await blockBlobClient.uploadData(file, {
        maxSingleShotSize: 1 * 1024 * 1024,
        onProgress: (progress) => {
            // find the percentage of uploaded
            let percent = Math.round((100 * progress.loadedBytes) / fileSize);
            progressPercent.innerText = percent;
            const scaleX = `scaleX(${percent / 100})`;
            bgProgress.style.transform = scaleX;
            progressBar.style.transform = scaleX;
        },
    });
    onFileUploadSuccess(await axios.post(linkGenerateApiUrl, { fileName, fileSize, containerName })
        .then(response => JSON.stringify({
            file: response.data.shorturl,
        }))
        .catch((error) => { throw Error(error) })
    );
}

const onFileUploadSuccess = (res) => {
    fileInput.value = ""; // reset the input
    status.innerText = "Uploaded";

    // remove the disabled attribute from form btn & make text send
    emailForm[2].removeAttribute("disabled");
    emailForm[2].innerText = "Send";
    progressContainer.style.display = "none"; // hide the box

    const { file: url } = JSON.parse(res);
    console.log(url);
    sharingContainer.style.display = "block";
    fileURL.value = url;
};

