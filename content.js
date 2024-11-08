let videoSpeedInterval; // Declare a global variable for the interval ID

// Helper function to get the currently playing video
function getCurrentlyPlayingVideo() {
    const videos = document.querySelectorAll("video");
    for (let video of videos) {
        if (!video.paused && !video.ended && video.currentTime > 0) {
            return video; // Return the currently playing video element
        }
    }
    return null; // Return null if no video is currently playing
}

// Function to check background color and modify video speed if the criteria match
function checkAndModifyVideoSpeed() {
    const elements = document.querySelectorAll(".ytp-swatch-background-color");

    elements.forEach(element => {
        const bgColor = window.getComputedStyle(element).backgroundColor;

        // Parse the background color and check if it meets the criteria
        const match = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        if (match) {
            const red = parseInt(match[1]);
            const green = parseInt(match[2]);
            const blue = parseInt(match[3]);

            // Check for red 255 and green > 200
            if (red === 255 && green > 200) {
                const video = getCurrentlyPlayingVideo();
                if (video) {
                    // Increase video playback speed to 12 (max 16)
                    video.playbackRate = 12;
                    console.log("YTAS: Video playback speed set to 12", video);
                    // Clear the current interval to stop repeated checks
                    clearInterval(videoSpeedInterval);

                    // Observe for the skip ad button
                    observeSkipAdButton(() => {
                        // After skip ad button is processed, restart the interval
                        // console.log("Restarting video speed check.");
                        videoSpeedInterval = setInterval(checkAndModifyVideoSpeed, 1000);
                    });
                }
            }
        }
    });
}

function observeSkipAdButton(callback) {
    const checkInterval = 500; // Check every 500 ms
    const maxTime = 5000; // Stop after 5 seconds
    let elapsedTime = 0;

    const intervalId = setInterval(() => {
        const skipButton = document.querySelector(".ytp-skip-ad-button");

        if (skipButton) {
            console.log("YTAS: Skip AD button found", skipButton);
            skipButton.click(); // Click the skip ad button if found
            console.log("YTAS: Skip ad button clicked.");
            clearInterval(intervalId); // Clear interval to stop further checks
            if (callback) callback(); // Call the callback to restart the observer
        } else {
            elapsedTime += checkInterval;
            if (elapsedTime >= maxTime) {
                clearInterval(intervalId); // Stop checking after 5 seconds
                console.log("YTAS: No skip ad button found within 5 seconds.");
                if (callback) callback(); // Call the callback even if no button was found
            }
        }
    }, checkInterval);
}

// Initial check and start monitoring the DOM at intervals
videoSpeedInterval = setInterval(checkAndModifyVideoSpeed, 1000);
