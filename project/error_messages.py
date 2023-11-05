from enum import Enum

class ErrorMessages(Enum):
    UNKNOWN_VALUE_ERROR = "Your voice is not clear, please repeat the message"
    REQUEST_ERROR = "Could not request results from Google Web Speech API; {}"
    NO_AUDIO = "No audio data received"