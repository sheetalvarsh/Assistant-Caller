from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS
# from speech_recognition import recognize_speech
import os

# import pyttsx3
import soundfile as sf
# import pygame

audio_messages = []  # Initialize an empty list to store message history

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html', audio_messages = audio_messages)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        message = request.form.get('message-input')
       
        # Create a unique filename for each audio message
        output_filename = f'output_{len(audio_messages) + 1}.ogg'
        output_audio_path = os.path.join('project/static', 'audio', output_filename)
        # output_audio_path = os.path.join('static', 'audio', output_filename)

        print('hihihihih', os.getcwd())

        # Convert the message to speech using gTTS
        tts = gTTS(message, lang='en')
        tts.save(output_audio_path)

        # Add the new audio message to the audio_messages list
        audio_messages.append(output_audio_path)

        # Limit the list to store only the last 5 audio messages
        if len(audio_messages) > 5:
            os.remove(audio_messages.pop(0))  # Remove the oldest message

        return render_template('index.html', audio_messages=audio_messages)
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/get-audio-messages', methods=['GET'])
def get_audio_messages():
    return jsonify({'audio_messages': audio_messages})

# @app.route('/text-to-speech', methods=['GET'])
# def text_to_speech():
#     try:
#         engine = pyttsx3.init()
#         engine.setProperty('rate', 150)  # Adjust the rate as needed
#         message = 'This is a very long test message to test the text to speech functionality.'

#         # Save the text as an audio file
#         engine.save_to_file(message, 'output.wav')
#         engine.runAndWait()

#         # Load audio data using soundfile
#         data, samplerate = sf.read('output.wav')

#         # Adjust the samplerate if needed
#         samplerate = samplerate // 2

#         # Initialize pygame mixer
#         pygame.mixer.init(frequency=samplerate)

#         # Convert audio data to bytes
#         audio_bytes = (data * 32767).astype('int16').tobytes()

#         # Load audio into pygame mixer
#         sound = pygame.mixer.Sound(audio_bytes)

#         # Play audio using pygame mixer
#         sound.play()

#         return 'Text-to-speech functionality executed successfully'
#     except Exception as e:
#         return f'Error: {str(e)}'


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
