function textToSpeech() {
  // Get the text input
  var messageInput = document.getElementById('message-input').value;

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

      // Set the audio source to the generated audio
      document.querySelector("audio source").src = data.user_audio;

      // Update the audio player
      var audio = document.querySelector("audio");
      audio.load();
      audio.play();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function speechToText() {
  var audioInput = document.getElementById('audio-input').files[0];

  var formData = new FormData();
  formData.append('audio-input', audioInput);

  // Send a POST request for speech-to-text
  fetch('/speech-to-text', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      // Update the recognized text in the textarea
      document.getElementById('output-text').value = data.recognized_text;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}