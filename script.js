console.log("📋 SCRIPT LOADED");

function main() {
  listen();
}

// Step 1 Listen to user question
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
    llmCall(transcript);
  };

  // 6. Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error detected: " + event.error);
  };

  // Make the LLM call now with user speech
}

// Step 2 Add system prompt and send the user question to LLM
async function llmCall(userText = "") {
  const OPENAI_API_KEY =
    "YOUR OPEN API KEY";

  const SYSTEM_PROMT = "";

  const llmResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: `System Context: ${SYSTEM_PROMT}
        User Query:${userText}`,
    }),
  }).then((res) => res.json());
  console.log("📋 llmResponse ", llmResponse);
  const textOutput = llmResponse.output
    .flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text");

  console.log("📋 textOutput", textOutput);
  return textOutput?.text ?? "Unable to connect with LLM";
}

main();
