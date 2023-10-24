function textToSpeech() {
  const messageInput = document.getElementById('message-input').value.trim();
  const outputText = document.getElementById('output-text');

  if (messageInput === '') {
    alert('Please enter a message before sending.');
    return;
  }

  fetch('/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'message-input=' + encodeURIComponent(messageInput),
  })
    .then(response => response.json())
    .then(data => {
      outputText.value = data.recognized_text;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function loadAudioMessages() {
  fetch('/load-audio-messages', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      const audioMessages = data.audio_messages;
      const audioContainer = document.querySelector(".audio-container ul");
      audioContainer.innerHTML = "";

      audioMessages.forEach(audioMessage => {
        const listItem = document.createElement("li");
        const audioElement = document.createElement("audio");
        audioElement.controls = true;

        const sourceElement = document.createElement("source");
        sourceElement.src = audioMessage.AudioFileName;
        sourceElement.type = "audio/ogg";

        listItem.appendChild(audioElement);
        audioElement.appendChild(sourceElement);

        audioContainer.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call the loadAudioMessages function to load and display audio messages
loadAudioMessages();

function speechToText() {
  const audioInput = document.getElementById('audio-input').files[0];
  const formData = new FormData();
  formData.append('audio-input', audioInput);

  fetch('/speech-to-text', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('output-text').value = data.recognized_text;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
