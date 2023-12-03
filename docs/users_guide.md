# User's Guide: Speech-to-Text and Text-to-Speech Application

## Table of Contents
    Introduction
    Getting Started
    Prerequisites
    Installation
    Using the Application
    Text-to-Speech
    Speech-to-Text
    Troubleshooting
    Common Issues
    Feedback and Support
    Appendix: Developer's Documentation

## Introduction
    Welcome to the Speech-to-Text and Text-to-Speech application! This web-based tool allows you to convert text messages into speech and speech messages into text. It's a versatile application that can be used for various purposes, such as creating audio messages or transcribing spoken content.

## Getting Started

### Prerequisites

Before using the application, ensure you have the following prerequisites installed:

* Python (3.x recommended)
* Flask
* pydub
* SpeechRecognition
* gTTS (Google Text-to-Speech)
* Installation
* Clone or download the project repository to your local machine.


## Installation

1. Clone or download the project repository to your local machine

    ``` git clone https://github.com/sheetalvarsh/VoiceBot_HCI584 ```
    Navigate to the project directory.

2. Navigate to the project directory.

    ```cd VoiceBot_HCI584```

3. Install the required Python packages

    ```pip install -r requirements.txt```

## Using the Application

### Text-to-Speech

1. Launch the application by running the following command:

    ```python app.py```

2. Open your web browser and go to http://127.0.0.1:5000/.
3. In the input field labeled "Type your message," enter the text you want to convert to speech.
4. Click the "Send" button (paper plane icon) to generate the audio message.
5. Listen to the audio message using the playback controls.

### Speech-to-Text

1. Follow the steps above to launch the application.
2. Click the microphone icon to start recording your speech message.
3. Speak clearly into your microphone.
4. Click the "Stop" button (square icon) to stop recording.
5. The application will transcribe your speech into text and display it on the page.

## Troubleshooting

### Common Issues

If you encounter any issues while using the application, here are some common solutions:

* No Audio Output:

    - Ensure your speakers or headphones are properly connected.
    - Check the volume settings on your device.

* Speech Recognition Issues:

    - Speak clearly into the microphone.
    - Check for background noise that may interfere with speech recognition.

## Appendix: Developer's Documentation
    For more technical details about the application, including setup instructions for developers and API documentation, refer to the [Developer's Documentation](developers_guide.md)