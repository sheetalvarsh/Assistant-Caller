import os
import csv
from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS

app = Flask(__name__)

# Define the directory for audio files
audio_directory = os.path.join(app.root_path, 'static', 'audio')
if not os.path.exists(audio_directory):
    os.makedirs(audio_directory)

# Define the path for the audio metadata CSV file
audio_metadata_file = os.path.join(app.root_path, 'audio_metadata.csv')

# Create an empty list to store audio messages
audio_messages = []

# Define a function to save audio metadata to the CSV file
def save_audio_metadata(metadata):
    if not os.path.exists(audio_metadata_file):
        with open(audio_metadata_file, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['MessageID', 'MessageText', 'AudioFileName'])

    with open(audio_metadata_file, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(metadata)

# Define a function to load audio metadata from the CSV file
def load_audio_metadata():
    if not os.path.exists(audio_metadata_file):
        return []

    metadata = []
    with open(audio_metadata_file, newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            metadata.append(row)

    return metadata

# Load existing audio metadata
audio_messages = load_audio_metadata()

@app.route('/')
def index():
    return render_template('index.html', audio_messages=audio_messages)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        message = request.form.get('message-input')
        if message:
            # Create a unique filename for each audio message
            output_filename = f'output_{len(audio_messages) + 1}.ogg'
            output_audio_path = os.path.join(audio_directory, output_filename)

            # Convert the message to speech using gTTS
            tts = gTTS(message, lang='en')
            tts.save(output_audio_path)

            # Add the new audio message to the audio_messages list
            audio_messages.append({
                'MessageID': len(audio_messages) + 1,
                'MessageText': message,
                'AudioFileName': output_filename
            })

            # Save audio metadata to the CSV file
            save_audio_metadata([len(audio_messages), message, output_filename])

            # Return metadata of the created audio message
            return jsonify({
                'recognized_text': message,
                'user_audio': output_filename
            })
        else:
            return jsonify({'error': 'No text to speak'})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/load-audio-messages', methods=['GET'])
def load_audio_messages():
    audio_messages = load_audio_metadata()
    return jsonify({'audio_messages': audio_messages})

@app.route('/get-audio/<filename>')
def get_audio(filename):
    return send_from_directory(audio_directory, filename)

if __name__ == '__main__':
    app.run(debug=True)
