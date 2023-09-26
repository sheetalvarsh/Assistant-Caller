from gtts import gTTS

def text_to_speech(text, output_file):
    tts = gTTS(text, lang='en')
    tts.save(output_file)
