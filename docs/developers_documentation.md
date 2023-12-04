# Developer's Documentation

Welcome to the developer's documentation for the Speech-to-Text and Text-to-Speech application. This guide provides technical details about the application, including setup instructions for developers and API documentation.

## Table of Contents

1. Project Structure
2. Installation
3. Dependencies
4. Configuration
5. API Documentation
6. Text-to-Speech API
7. Speech-to-Text API
8. Contributing
9. License

## Project Structure
The project follows a typical Flask application structure. Here's a brief overview of the key directories and files:

* app.py: Main application file.
* static/: Static assets, including audio files.
* templates/: HTML templates for rendering web pages.
* requirements.txt: List of Python dependencies.

## Installation
To set up the development environment, follow these steps:

Clone or download the project repository.

## Installation

1. Clone or download the project repository to your local machine

    ``` git clone https://github.com/sheetalvarsh/VoiceBot_HCI584 ```
    Navigate to the project directory.

2. Navigate to the project directory.

    ```cd VoiceBot_HCI584```

3. Install the required Python packages

    ```pip install -r requirements.txt```

## Dependencies
The application relies on the following Python libraries:

* Flask: Web framework for building the application.
* pydub: Audio processing library.
* SpeechRecognition: Speech recognition library.
* gTTS: Google Text-to-Speech library.

These dependencies are listed in the requirements.txt file.

## Configuration
The application uses Flask-Session for session management. The session type is set to 'filesystem' for file storage. Configuration details can be found in `app.py`.

## API Documentation

### Text-to-Speech API

Endpoint
- `/text-to-speech`

Request
- Method: `POST`
- Parameters:
    - message-input: The text message to be converted to speech.

Response
* Success:
    - Status Code: `200`
    - JSON: `{ 'recognized_text': <message>, 'user_audio': <audio_filename> }`

* Error:
    - Status Code: `500`
    - JSON: `{ 'error': <error_message> }`

### Speech-to-Text API

Endpoint
- `/upload_audio`

Request
* Method: `POST`
* Parameters:
    - `audio: The audio file to be transcribed.`

Response

* Success:
    - Status Code: `200`
    - JSON: `{ 'text': <transcribed_text> }`

* Error:
    - Status Code: `500`
    - JSON: `{ 'error': <error_message> }`

## License
This project is licensed under the [MIT License] (../LICENSE.md).