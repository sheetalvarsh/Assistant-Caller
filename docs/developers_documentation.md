# Developer's Documentation

Welcome to the developer's documentation for the *Speech-to-Text* and *Text-to-Speech* application. This guide provides technical details about the application, including setup instructions for developers and API documentation.

## Table of Contents

1. Project Structure
2. Installation
3. Dependencies
4. Configuration
5. API Documentation
6. Text-to-Speech API
7. Speech-to-Text API
8. License

## Project Structure
The project follows a typical Flask application structure. Here's a brief overview of the key directories and files:

* **app.py**: Main application file.
* **static/**: Static assets, including audio files.
* **templates/**: HTML templates for rendering web pages.
* **requirements.txt**: List of Python dependencies.

![Alt text](<./document_images/project_structure.png>)

## Installation
To set up the development environment, follow these steps:

1. Clone or download the project repository to your local machine

    `git clone https://github.com/sheetalvarsh/VoiceBot`

2. Navigate to the directory.

    `cd VoiceBot`

3. Install the required Python packages

    `pip install -r requirements.txt`

## Dependencies
The application relies on the following Python libraries:

* **Flask**: Web framework for building the application.
* **pydub**: Audio processing library.
* **SpeechRecognition**: Speech recognition library.
* **gTTS**: Google Text-to-Speech library.

These dependencies are listed in the `requirements.txt` file.

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

## Dealing with Audio Data

### Storage and Generation

1. Folder Structure:
    - Audio files are stored in a dedicated folder based on the user's session. This ensures a clear organization of audio data.

2. Session-based Storage:
    - With each session, a new set of audio files is generated and stored. This helps maintain a separation of audio data between different users or sessions.

3. File Limitation:
    - To optimize storage and prevent excessive resource usage, the application follows a policy where only the latest 5 audio files are retained. When a new audio file is generated, the oldest one is removed from the system.

## Handling Audio Data

1. Audio File Format:
    - The application utilizes the **OGG format** for storing audio files. This format is commonly used for efficient audio compression.

2. Audio Processing:
    - **Pydub**, an audio processing library, is employed for handling audio files. It allows for various operations such as format conversion, channel adjustment, and sample rate modification.

3. Text-to-Speech (TTS):
    - When converting text to speech, the **gTTS (Google Text-to-Speech)** library is utilized. The generated audio file is then saved in the corresponding session folder.

4. Speech-to-Text (STT):
    - For transcribing speech to text, the application uses the **SpeechRecognition** library. The uploaded audio file is processed, and the transcribed text is extracted.

## License
This project is licensed under [MIT LICENSE](../LICENSE)
