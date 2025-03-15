document.addEventListener("DOMContentLoaded", async () => {
    const downloadBtn = document.getElementById("downloadBtn");
    const countElement = document.getElementById("count");

    async function updateDownloadCount() {
        const cacheKey = "githubDownloadCount";
        const cacheTimeKey = "githubDownloadTime";

        // Show loading text
        countElement.textContent = "Loading...";

        // Check cache (30 min)
        const cachedData = localStorage.getItem(cacheKey);
        const lastFetchedTime = localStorage.getItem(cacheTimeKey);
        if (cachedData && lastFetchedTime && (Date.now() - lastFetchedTime < 30 * 60 * 1000)) {
            countElement.textContent = cachedData;
            return;
        }

        const apiUrl = "https://api.github.com/repos/shivi9393/FIle_organizer_tkinter/releases/latest";

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            let totalDownloads = 0;
            if (data.assets && data.assets.length > 0) {
                data.assets.forEach(asset => {
                    totalDownloads += asset.download_count;
                });
            }

            countElement.textContent = totalDownloads;

            // Cache the result
            localStorage.setItem(cacheKey, totalDownloads);
            localStorage.setItem(cacheTimeKey, Date.now());
        } catch (error) {
            console.error("Error fetching download count:", error);
            countElement.textContent = "N/A"; // Fallback if API fails
        }
    }

    updateDownloadCount();

    downloadBtn.addEventListener("click", () => {
        alert("Your download is starting...");

        // Track click in Google Analytics
        gtag('event', 'download_click', {
            'event_category': 'Downloads',
            'event_label': 'File Organizer'
        });

        // Delay before redirecting to prevent issues
        // setTimeout(() => {
        //     window.location.href = "https://github.com/shivi9393/FIle_organizer_tkinter/releases/download/v1.0/FileOrganizer.zip";
        // }, 500);
    });
});
