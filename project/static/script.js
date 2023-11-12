

// constant values for error messages
const ErrorMessages = {
  UNKNOWN_VALUE_ERROR: "Your voice is not clear, please repeat the message",
  REQUEST_ERROR: "Could not request results from Google Web Speech API; {}",
  NO_AUDIO: "No audio data received",
};

function textToSpeech() {
  // Get the text input
  var messageInput = document.getElementById('message-input').value;

  // Check if the message is not empty
  if (messageInput.trim() === '') {
    alert('Please enter a message before sending.');
    return;
  }

  // Send a POST request for text-to-speech
  fetch('/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'message-input=' + encodeURIComponent(messageInput),
  })
    .then(response => response.json())
    .then(data => {
      // Get the audio controls container
      var audioContainer = document.querySelector(".audio-container ul");
      audioContainer.innerHTML = "";

      // Add the new audio message to the audio player
      var audioElement = document.createElement("audio");
      audioElement.controls = true;
      var sourceElement = document.createElement("source");
      sourceElement.src = data.user_audio;
      sourceElement.type = "audio/ogg";
      audioElement.appendChild(sourceElement);
      var listItem = document.createElement("li");
      listItem.appendChild(audioElement);
      audioContainer.appendChild(listItem);

      //temporary fix, will be removed
      location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/** --------------- speech-to-text ---------------- */
isFirstLoad = true;

// Add an event listener to execute the updateUI function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  updateUI();
});

// Getting audio message for speech-to-text
const audioChunks = [];
let mediaRecorder;

const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');

startRecordingButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        sendAudioData(audioBlob);
        audioChunks.length = 0;
      };

      mediaRecorder.start();
      startRecordingButton.disabled = true;
      stopRecordingButton.disabled = false;
    })
    .catch((error) => {
      console.error("Error accessing the microphone: ", error);
    });
});

stopRecordingButton.addEventListener('click', () => {
  mediaRecorder.stop();
  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;
});

function sendAudioData(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  fetch('/upload_audio', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.error('upload - ', data);
      updateRecognizedText(data); // Update recognized text
      updateUI(); // Updating the UI based on recognized text
      // location.reload();
    })
    .catch((error) => {
      console.error('Error sending audio data to the server: ', error);
    });
}

// Update the recognized text in the HTML element
function updateRecognizedText(data) {
  const outputTextElement = document.getElementById('speech-output-text');
  const errorTextElement = document.getElementById('display-error');

  if (outputTextElement !== null) {
    outputTextElement.textContent = data.text;
    // location.reload();

    // Display error message if audio is not clear
    if (errorTextElement !== null) {
      if (data.error === ErrorMessages.UNKNOWN_VALUE_ERROR) {
        errorTextElement.classList.add('error');
        errorTextElement.textContent = data.error;
      } else {
        errorTextElement.classList.remove('error');
      }
    }
  }
}

// Check if recognized text is available and update the UI
function updateUI() {
  const text = document.getElementById('speech-output-text');
  if (text) {
    const recognizedText = text.textContent;
    console.error('recognized text -', text);
    const audioContainer = document.querySelector('.speech-output-container');
    if (recognizedText.trim() === '') {
      audioContainer.style.display = 'none';
    } else {
      audioContainer.style.display = 'block';
      location.reload();
    }
  }
}
