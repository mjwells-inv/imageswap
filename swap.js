// script.js
const form = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const resultFrame = document.getElementById('resultFrame');
const statusMessage = document.getElementById('statusMessage');

// List of random words
const randomWords = ["wildlife", "nature", "mountains", "ocean", "forests", "desert", "sunset", "river"];

function getRandomWord() {
    return randomWords[Math.floor(Math.random() * randomWords.length)];
}

function replaceImageLinks(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Replace image src attributes
    doc.querySelectorAll('img').forEach(img => {
        img.src = `https://loremflickr.com/800/600/${getRandomWord()}`;
    });

    // Replace background images in styles
    doc.querySelectorAll('[style]').forEach(el => {
        el.style.backgroundImage = el.style.backgroundImage.replace(
            /url\(["']?(.+?)["']?\)/g,
            `url(https://loremflickr.com/1920/600/${getRandomWord()})`
        );
    });

    // Replace CSS background images
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        link.remove(); // Simplified: remove external stylesheets
    });

    return doc.documentElement.outerHTML;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = urlInput.value;

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const html = data.contents;

        const modifiedContent = replaceImageLinks(html);

        // Display modified content in iframe
        const blob = new Blob([modifiedContent], { type: 'text/html' });
        resultFrame.src = URL.createObjectURL(blob);
        resultFrame.style.display = 'block';
        statusMessage.textContent = 'Content processed and displayed below!';
    } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
    }
});
