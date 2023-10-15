
import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS

app = Flask(__name__)

# Define the directory for audio files
audio_directory = os.path.join(app.root_path, 'static', 'audio')
if not os.path.exists(audio_directory):
    os.makedirs(audio_directory)

audio_messages = []

@app.route('/')
def index():
    return render_template('index.html', audio_messages=audio_messages)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        message = request.form.get('message-input')
        print('msg', message)
        if message:
            # Create a unique filename for each audio message
            output_filename = f'output_{len(audio_messages) + 1}.ogg'
            output_audio_path = os.path.join(audio_directory, output_filename)

            # Convert the message to speech using gTTS
            tts = gTTS(message, lang='en')
            tts.save(output_audio_path)

            # Add the new audio message to the audio_messages list
            audio_messages.append(output_filename)

            # Limit the list to store only the last 5 audio messages
            if len(audio_messages) > 5:
                old_audio_filename = audio_messages.pop(0)
                old_audio_path = os.path.join(audio_directory, old_audio_filename)
                os.remove(old_audio_path)  # Remove the oldest message

            return jsonify({'recognized_text': message, 'user_audio': output_filename})
        else:
            return jsonify({'error': 'No text to speak'})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/get-audio/<filename>')
def get_audio(filename):
    return send_from_directory(audio_directory, filename)

@app.route('/get-audio-messages', methods=['GET'])
def get_audio_messages():
    return jsonify({'audio_messages': audio_messages})

# Speech to text 
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        audio_file = request.files['audio-input']
        if not audio_file:
            return jsonify({'error': 'No audio file provided'})

        input_audio_path = 'project/static/audio/input.wav'
        audio_file.save(input_audio_path)
        print(input_audio_path)

        # Perform speech recognition using the separate module
        recognized_text = recognize_speech(input_audio_path)
        print('msg-', recognized_text)

        return jsonify({'recognized_text': recognized_text})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/static/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)
