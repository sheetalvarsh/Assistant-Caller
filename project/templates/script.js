
if (document.readyState !== 'loading') {
  console.log('document is already ready, just execute code here');
  myInitCode();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    console.log('document was not ready, place code here');
    myInitCode();
  });
}


function myInitCode() {
  const messageContainer = document.getElementById('message-container');
  const senderContainer = document.querySelector('.sender-container');
  const receiverContainer = document.querySelector('.receiver-container');
  const messageInput = document.querySelector('.message-input');
  const sendButton = document.querySelector('.send-button');

  sendButton.addEventListener('click', function () {

    const userMessage = messageInput.value.trim();
    console.error(userMessage);
    if (userMessage !== '') {
      // Append user message to the chat container
      appendMessage('sender', userMessage);
      // Clear the input field
      messageInput.value = '';

      // Send the user message to the server for text-to-speech conversion
      fetch('/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })
        .then(response => response.json())
        .then(data => {
          // Play the received audio
          const audio = new Audio(data.audio_url);
          audio.play();

          // Display the chatbot's response (simulated)
          setTimeout(function () {
            const chatbotResponse = 'This is a chatbot response.';
            appendMessage('receiver', chatbotResponse);
          }, 1000);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    console.error(message);
    messageContainer.appendChild(messageDiv);
  }
}