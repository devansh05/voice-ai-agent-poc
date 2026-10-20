console.log("📋 SCRIPT LOADED");

function main() {
  listen();
}

async function listen() {
  // Invoke window speech recognition object to start listening

  // 1. Handle browser compatibility prefixes
  const speechRecognition = window.webkitSpeechRecognition;

  // 2. Instantiate the speech recognition object
  const recognition = new speechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  // 4. Start the audio listener
  console.log("Speech recognition activated. Speak into your microphone.");
  // 6. Handle errors
  recognition.onstart = () => {
    console.log("Speech recognition started...");
  };

  // 5. Handle the result event
  recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("User: ", transcript);
  };

  // 6. Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error detected: " + event.error);
  };
}

main();
