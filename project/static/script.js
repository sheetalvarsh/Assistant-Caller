
// function textToSpeech() {
//   event.preventDefault();
//   // Get the text input
//   var messageInput = document.getElementById('message-input').value;
//   console.error('msg - ', messageInput);

//   // Check if there is text to speak
//   if (messageInput.trim() === '') {
//     alert('Please enter a message to speak.');
//     return;
//   }

//   // Send a POST request for text-to-speech
//   fetch('/text-to-speech', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: 'message-input=' + encodeURIComponent(messageInput),
//   })
//     .then(response => response.json())
//     .then(data => {
//       // Update the recognized text in the textarea
//       document.getElementById('output-text').value = data.recognized_text;

//       // Get the audio controls container
//       var audioContainer = document.querySelector(".audio-container ul");
//       audioContainer.innerHTML = "";

//       // Create an audio element for the new audio message
//       var audioElement = document.createElement("audio");
//       audioElement.controls = true;

//       // Construct the audio message URL based on the returned data
//       audioElement.src = '/get-audio/' + data.user_audio;
//       audioElement.type = "audio/ogg";

//       // Create a list item for the audio message
//       var listItem = document.createElement("li");
//       listItem.appendChild(audioElement);
//       audioContainer.appendChild(listItem);

//       audioElement.load();
//       // audioElement.play();
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }

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
