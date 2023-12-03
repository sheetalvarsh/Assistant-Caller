from pydub import AudioSegment
import speech_recognition as sr
from io import BytesIO
import os
from flask import Flask, render_template, request, jsonify, send_from_directory, session
from flask_session import Session  # Import the Session extension
from gtts import gTTS
from error_messages import ErrorMessages

app = Flask(__name__)
app.secret_key = 'SDKFJSDFOWEIOF'

# Configuring the app to use Flask-Session
# used 'filesystem' session type for file storage
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Define the directory for audio files
audio_directory = os.path.join(app.root_path, 'static', 'audio')
if not os.path.exists(audio_directory):
    os.makedirs(audio_directory)

speech_audio_directory = os.path.join(app.root_path, 'static', 'speech_audio')
if not os.path.exists(speech_audio_directory):
    os.makedirs(speech_audio_directory)

audio_messages = []
speech_messages = []
input_messages = []

@app.route('/')
def index():
    """
    Renders the index page with audio, input, and speech messages.

    Returns:
        str: HTML content for the index page.
    """
    text = session.get('text', '')
    return render_template('index.html', audio_messages=audio_messages, input_messages=input_messages, speech_messages=speech_messages)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    Converts text to speech and returns the audio file.

    Returns:
        dict: JSON response with recognized text and audio file information.
    """
    try:
        message = request.form.get('message-input')
        if message:
            output_filename = f'output_{len(audio_messages) + 1}.ogg'
            output_audio_path = os.path.join(audio_directory, output_filename)
            tts = gTTS(message, lang='en')
            tts.save(output_audio_path)
            audio_messages.append(output_filename)
            input_messages.append(message)

            # Limit the list to store only the last 5 audio messages
            if len(audio_messages) > 10:
                old_audio_filename = audio_messages.pop(0)
                old_audio_path = os.path.join(
                    audio_directory, old_audio_filename)
                os.remove(old_audio_path)  

            return jsonify({'recognized_text': message, 'user_audio': output_filename})
        else:
            return jsonify({'error': 'No text to speak'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/get-audio/<filename>')
def get_audio(filename):
    """
    Returns the specified audio file.

    Args:
        filename (str): Name of the audio file.

    Returns:
        str: Path to the requested audio file.
    """
    return send_from_directory(audio_directory, filename)

@app.route('/get-audio-messages', methods=['GET'])
def get_audio_messages():
    """
    Returns a JSON response with the list of audio messages.

    Returns:
        dict: JSON response with audio messages.
    """
    return jsonify({'audio_messages': audio_messages})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    """
    Handles the uploaded audio file, performs speech recognition, and returns the recognized text.

    Returns:
        dict: JSON response with recognized text or error message.
    """
    audio_data = request.files['audio']

    if audio_data:
        try:
            audio = AudioSegment.from_file(BytesIO(audio_data.read()))
            audio = audio.set_channels(1)
            audio = audio.set_frame_rate(16000)
            audio = audio.set_sample_width(2)
            audio.export(f'{speech_audio_directory}/converted_audio.wav', format='wav')

            r = sr.Recognizer()
            with sr.AudioFile(f'{speech_audio_directory}/converted_audio.wav') as source:
                audio_data = r.record(source)
                text = r.recognize_google(audio_data)

            session['text'] = text
            speech_messages.append(text)
            session.setdefault('speech_messages', []).append(text)

            return jsonify({'text': text})
        except sr.UnknownValueError:
            error = ErrorMessages.UNKNOWN_VALUE_ERROR.value
            return jsonify({'error': error})
        except sr.RequestError as e:
            error = ErrorMessages.REQUEST_ERROR.value
            return jsonify({'error': error})
    else:
        return jsonify({'text': ErrorMessages.NO_AUDIO.value})

@app.route('/get_speech_messages')
def get_speech_messages():
    """
    Returns a JSON response with the list of speech messages.

    Returns:
        dict: JSON response with speech messages.
    """
    return jsonify(speech_messages)

@app.route('/check_session')
def check_session():
    """
    Checks the session data.

    Returns:
        str: Session data information.
    """
    session['test_key'] = 'test_value'
    app.logger.info(f'Session data: {session.get("test_key")}')
    return f'Session data: {session.get("test_key")}'

@app.route('/get_session_messages')
def get_session_messages():
    """
    Returns a JSON response
    """
    messages = session.get('speech_messages', [])
    return jsonify({'speech_messages': messages})

if __name__ == '__main__':
    app.run(debug=True)