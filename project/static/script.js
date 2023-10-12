// function textToSpeech() {
//   // Get the text input
//   var messageInput = document.getElementById('message-input').value;

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

//       // Set the audio source to the generated audio
//       document.querySelector("audio source").src = data.user_audio;

//       // Update the audio player
//       var audio = document.querySelector("audio");
//       audio.load();
//       audio.play();
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }
document.addEventListener("DOMContentLoaded", function () {
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
      .then(response => response.text())
      .then(data => {
        // Update the recognized text in the textarea
        document.getElementById('output-text').value = data;

        // Get the audio controls container
        var audioContainer = document.querySelector(".audio-container ul");
        audioContainer.innerHTML = "";

        // Request the latest audio messages and update the audio player
        fetch('/get-audio-messages')
          .then(response => response.json())
          .then(data => {
            data.audio_messages.forEach(function (audioMessage) {
              var audioElement = document.createElement("audio");
              audioElement.controls = true;
              var sourceElement = document.createElement("source");
              // Construct the audio message URL using url_for
              sourceElement.src = '{{ url_for("static", filename="' + audioMessage + '") }}';
              sourceElement.type = "audio/ogg";
              audioElement.appendChild(sourceElement);
              var listItem = document.createElement("li");
              listItem.appendChild(audioElement);
              audioContainer.appendChild(listItem);

              var audio = document.querySelector("audio");
              audio.load();
              audio.play();
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
});


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
