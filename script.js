const OPENAI_API_KEY = "YOUR OPEN API KEY";

const SYSTEM_PROMT = "";

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
  // 6. Handle errors
  recognition.onstart = () => {
    console.log("Speech recognition started...");
  };

  // 5. Handle the result event
  recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    // Make the LLM call now with user speech
    llmCall(transcript);
  };

  // 6. Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error detected: " + event.error);
  };
}

// Step 2 Add system prompt and send the user question to LLM
async function llmCall(userText = "") {
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
  const textOutput = llmResponse.output
    .flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text");

  // convert the llm response to speech
  await speak(textOutput?.text ?? "");
}

// convert text from llm response to speech
async function speak(llmResponse) {

  const llmSpeechMp3Response = await fetch(
    "https://api.openai.com/v1/audio/speech",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "sage",
        input: `System Context: ${SYSTEM_PROMT}
        User Query:${llmResponse}.`,
        instructions: "Always speak in a cheerfull warm and natural tone.",
      }),
    },
  );

  const audioBlob = await llmSpeechMp3Response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  audio.play();

  audio.onended = () => URL.revokeObjectURL(audioUrl);
}

main();
