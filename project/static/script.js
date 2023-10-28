
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
      // Update the recognized text in the textarea
      document.getElementById('output-text').value = data.recognized_text;

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

//getting audio message for speech-to-text
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
  console.error('inside send', audioBlob);

  const formData = new FormData();
  formData.append('audio', audioBlob);

  fetch('/upload_audio', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error sending audio data to the server: ', error);
    });
}

// function speechToText() {
//   var audioInput = document.getElementById('audio-input').files[0];

//   var formData = new FormData();
//   formData.append('audio-input', audioInput);

//   // Send a POST request for speech-to-text
//   fetch('/speech-to-text', {
//     method: 'POST',
//     body: formData,
//   })
//     .then(response => response.json())
//     .then(data => {
//       // Update the recognized text in the textarea
//       document.getElementById('output-text').value = data.recognized_text;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }
