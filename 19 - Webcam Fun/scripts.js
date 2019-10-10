const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

getVideo = () => {
    //use this expression and methods to get the video media, then play them
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(error => {
            console.error('WHAAAAT?', error);
        });
}

paintToCanvas = () => {
    //set the video's width and height to the hardcoded width and height of the canvas
    const width = video.videoWidth;
    const height = video.videoHeight;   
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        //udpate what the canvas displays according to this interval
        ctx.drawImage(video, 0, 0, width, height);
        //pixels variable is an array of alllllll of the pixels in the canvas video, there are thousands of properties
        let pixels = ctx.getImageData(0, 0, width, height);
        //take pixels and manipulate them according to various functions defined elsewhere
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = .1;
        pixels = greenScreen(pixels);
        //then put them back onto the canvas
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

takePhoto = () => {
    //this plays the audio with the class of snap
    snap.currentTime = 0;
    snap.play();

    //take data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    //creates an anchor link with the ability to download image on click
    const link = document.createElement('a');
    //its source is the image of the canvas at click's event
    link.href = data;
    link.setAttribute('download', 'handsome');
    //saves image download anchor as the image itself
    link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`;
    strip.insertBefore(link, strip.firstChild);
}

redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        //for each of the red pixels, green pixels, and blue pixels values in the canvas, change their values so that the canvas has a red effect
        pixels.data[i + 0] = pixels.data[i + 0] + 100;//red
        pixels.data[i + 1] = pixels.data[i + 1] - 50;//green
        pixels.data[i + 2] = pixels.data[i + 2] * .5;//blue
    }
    return pixels;
}

rgbSplit = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        //very similar to redEffect, except changing them so that canvas has a distorted effect
        pixels.data[i - 150] = pixels.data[i + 0] + 100;//red
        pixels.data[i + 500] = pixels.data[i + 1] - 50;//green
        pixels.data[i - 500] = pixels.data[i + 2] * .5;//blue
    }
    return pixels;
}

greenScreen = (pixels) => {
    //this function enables sliders to change video's display to green screen effect
    const levels = {};

    //grab the inputs and set the level object's properties to their names and their values
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        //redefine each of the pixel data variables in this loop to reflect the colour the value targets
        let red = pixels.data[i + 0];
        let green = pixels.data[i + 1];
        let blue = pixels.data[i + 2];
        let alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            //if the values are anywhere between min and max values, then make the video transparent
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();

//event listener here will update the canvas so long as the video is playing, using the canplay listener
video.addEventListener('canplay', paintToCanvas);
