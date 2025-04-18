<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Link Replacer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
        }

        #output {
            margin-top: 20px;
            text-align: left;
            border: 1px solid #ccc;
            padding: 10px;
            width: 80%;
            margin: 20px auto;
            overflow: auto;
            max-height: 500px;
        }

        input, button {
            padding: 10px;
            margin: 10px;
        }
    </style>
</head>
<body>
    <h1>Image Link Replacer</h1>
    <p>Enter a URL to fetch and replace its image links:</p>
    <input type="url" id="urlInput" placeholder="Enter a valid URL" required>
    <button onclick="processPage()">Process</button>
    <div id="output"></div>

    <script>
        function getRandomWord() {
            const words = ["wildlife", "nature", "mountains", "ocean", "forests", "desert", "sunset", "river"];
            return words[Math.floor(Math.random() * words.length)];
        }

        async function processPage() {
            const url = document.getElementById('urlInput').value;
            const output = document.getElementById('output');

            if (!/^https?:\/\/.+/i.test(url)) {
                alert('Please enter a valid URL starting with http:// or https://');
                return;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                let html = await response.text();

                // Replace <img> src attributes
                html = html.replace(/<img [^>]*src="([^"]*)"/g, (match, src) => {
                    return match.replace(src, `https://loremflickr.com/800/600/${getRandomWord()}`);
                });

                output.innerHTML = html;
            } catch (error) {
                console.error(error);
                output.textContent = `Failed to fetch the URL: ${error.message}`;
            }
        }
    </script>
</body>
</html>
