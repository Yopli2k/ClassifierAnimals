/**
 * Script for the Teachable Machine image classifier.
 */
let model, maxPredictions;
const URL = "./model/"; // Path to the model folder
const labelContainer = document.getElementById("label-container");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("preview");

/** Load the Teachable Machine model */
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer.innerText = "Model loaded. Upload or select an image.";
}
loadModel();

/** Handle uploaded image */
imageInput.addEventListener("change", async function (event) {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
        previewImage.onload = () => {
            predict(previewImage);
        };
    }
});

/** Handle selecting a test image */
function selectTestImage(imagePath) {
    previewImage.src = imagePath;
    previewImage.style.display = "block";
    previewImage.onload = () => {
        predict(previewImage);
    };
}

/** Run a prediction on the selected image */
async function predict(image) {
    if (!model) {
        labelContainer.innerText = "Error: Model not loaded.";
        return;
    }

    const prediction = await model.predict(image);
    let highestPrediction = { className: "", probability: 0 };
    prediction.forEach(p => {
        if (p.probability > highestPrediction.probability) {
            highestPrediction = p;
        }
    });

    labelContainer.innerHTML = `Prediction: ${highestPrediction.className} (${(highestPrediction.probability * 100).toFixed(2)}%)`;
}