import speech_recognition as sr

def recognize_speech(audio_file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)
    recognized_text = recognizer.recognize_google(audio, language='en-US')
    return recognized_text
