from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS
from speech_recognition import recognize_speech
import os

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        message = request.form.get('message-input')
       
        # Convert the message to speech using gTTS
        tts = gTTS(message, lang='en')
        output_audio_path = 'project/static/audio/output.ogg'
        tts.save(output_audio_path)

        # Set the user_audio variable with the audio source URL
        user_audio = '/static/audio/output.ogg'

        return render_template('index.html', user_audio=user_audio)
    except Exception as e:
        return jsonify({'error': str(e)})

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
