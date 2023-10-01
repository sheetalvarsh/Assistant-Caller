from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS
import speech_recognition as sr
import os

app = Flask(__name__, static_url_path='/static')
recognizer = sr.Recognizer()

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

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        audio_file = request.files['audio-input']
        input_audio_path = 'project/static/audio/input.wav'
        audio_file.save(input_audio_path)

        # Perform speech recognition
        with sr.AudioFile(input_audio_path) as source:
            # recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
            audio = recognizer.record(source)  # Record the audio

        recognized_text = recognizer.recognize_google(audio, language='en-US')
        print('msg-', recognized_text)

        return render_template('index.html', recognized_text=recognized_text)
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/static/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)
