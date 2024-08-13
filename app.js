const express = require('express');
const path = require('path');
const { main, isLoomVideoUrl } = require('./download');
const app = express();
const port = 8080;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle JSON requests
app.use(express.json());

// Endpoint to download video
app.post('/download-video', async (req, res) => {
    const url = req.body.url;

    if (!url || (url && !isLoomVideoUrl(url))) {
        return res.json({ success: false, message: "Please provide a loom video URL!" });
    }

    try {
        const response = await main(url);
        if (response.success) {
            return res.json({ success: true, downloadUrl: response.downloadUrl });
        } else {
            return res.json({ success: false, message: response.message });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
