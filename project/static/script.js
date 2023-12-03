

// constant values for error messages
const ErrorMessages = {
  UNKNOWN_VALUE_ERROR: "Your voice is not clear, please repeat the message",
  REQUEST_ERROR: "Could not request results from Google Web Speech API; {}",
  NO_AUDIO: "No audio data received",
};

//handles input when enter key is pressed
function submitOnEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // to prevent the default behavior 
    textToSpeech(); // Calling the textToSpeech function when Enter is pressed
  }
}

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
// Add an event listener to execute the updateUI function when the DOM is fully loaded
let speech_messages_list = [];

async function fetchSpeechMessages() {
  try {
    const response = await fetch('/get_speech_messages');
    const data = await response.json();
    speech_messages_list = data;
    updateUI();
    if(data.length <= 1) location.reload();
  } catch (error) {
    console.error('Error fetching speech messages:', error);
  }
}

// Getting audio message for speech-to-text
const audioChunks = [];
let mediaRecorder;

const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');

// Hide stop redording button initially
stopRecordingButton.style.display = 'none';

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

      // Toggling audio recording buttons
      startRecordingButton.style.display = 'none';
      stopRecordingButton.style.display = 'inline-block';
      stopRecordingButton.disabled = false;
    })
    .catch((error) => {
      console.error("Error accessing the microphone: ", error);
    });
});

stopRecordingButton.addEventListener('click', () => {
  mediaRecorder.stop();
  startRecordingButton.style.display = 'inline-block';
  stopRecordingButton.style.display = 'none';
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
      updateRecognizedText(data); // Update recognized text
      updateUI(); // Updating the UI based on recognized text
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
    if (data.error === ErrorMessages.UNKNOWN_VALUE_ERROR) {
      errorTextElement.classList.add('error'); // Display error message if audio is not clear
      errorTextElement.textContent = data.error;
    } else {
      outputTextElement.textContent = data.text;
      errorTextElement.classList.remove('error');
      location.reload();
    }
  }
}

async function updateUI() {
  await fetchSpeechMessages();
  const audioContainer = document.querySelector('.speech-output-container');
  audioContainer.style.display = speech_messages_list.length === 0 ? 'none' : 'block';
}