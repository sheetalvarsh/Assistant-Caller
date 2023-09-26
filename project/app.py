from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        message = request.form.get('message-input')
       
        # Convert the message to speech using gTTS
        tts = gTTS(message, lang='en')
        audio_path = 'project/static/audio/output.mp3'
        tts.save(audio_path)

        # return jsonify({'audio_url': audio_path})
        return render_template('index.html', user_audio = audio_path)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/static/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True)
