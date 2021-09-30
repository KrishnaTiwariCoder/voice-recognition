const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const API_KEY = "AIzaSyCk8QjyTwVa41cbzhjAguZowm482w986-o";

const btn = document.getElementById("talk-youtube");
const talkBtn = document.getElementById("talk");
const content = document.getElementById("content");
const resultsDiv = document.getElementById("results");
const instance = new SpeechRecognition();

let voices = [];

let randomGreetingReplies = [
  "I'm good , you tell",
  "Nothing much , tell me about yourself ",
  "Bhai tu bata kaisa hai",
  "Jyada kuch nhi , tu bata !",
];

let randomReplies = [
  "Bhai abhi toh khali baitha hu , tera kya chal raha hai ",
  "Chodd na yaar ye baate , tu bata tera kya chal raha hai",
];

const getVoiceMessage = async (type) => {
  instance.start();

  let res = new Promise((resolve, reject) => {
    instance.onstart = () => {
      console.log("voice activated");
      if (type == "youtube") {
        btn.innerHTML = "Listening ...";
        btn.disabled = true;
      } else {
        talkBtn.innerHTML = "Listening ...";
        talkBtn.disabled = true;
      }
    };

    instance.onresult = (event) => {
      if (type == "youtube") {
        btn.innerHTML = "Search Youtube";
        btn.disabled = false;
      } else {
        talkBtn.innerHTML = "Talk with me";
        talkBtn.disabled = false;
      }

      const resultIndex = event.resultIndex;

      const text = event.results[resultIndex][0].transcript;

      content.innerHTML = text;
      resolve(text);
    };
  });

  return await res;
};

window.speechSynthesis.onvoiceschanged = function () {
  voices = window.speechSynthesis.getVoices();
};

btn.addEventListener("click", async () => {
  const voiceMessage = await getVoiceMessage("youtube");
  showResults(voiceMessage);
});

talkBtn.addEventListener("click", async () => {
  const voiceMessage = await getVoiceMessage("talk");
  talkWithMe(voiceMessage);
});

const showResults = async (search) => {
  const url = "https://www.googleapis.com/youtube/v3/search";

  const res = await fetch(
    `${url}?key=${API_KEY}&part=snippet&q=${search}&maxResults=20`
  );

  const data = await res.json();

  resultsDiv.innerHTML = "";

  data.items.map((video) => {
    const div = document.createElement("div");
    const iframe = document.createElement("iframe");

    iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
    iframe.width = 500;
    iframe.height = 320;

    div.append(iframe);

    resultsDiv.appendChild(div);
  });
};

const readOutLoud = (message) => {
  const speech = new SpeechSynthesisUtterance();

  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;
  speech.text = message;
  speech.voice = voices[10];

  window.speechSynthesis.speak(speech);
};

const talkWithMe = (message) => {
  if (message.includes("how are you")) {
    readOutLoud(randomGreetingReplies[Math.floor(Math.random() * 4)]);
  } else if (message.includes("kya kar")) {
    readOutLoud(randomReplies[Math.floor(Math.random() * 2)]);
  } else if (message.includes("Search") || message.includes("search")) {
    readOutLoud("search mat karva yaar");
  } else if (message.includes("kaisa h")) {
    readOutLoud(randomGreetingReplies[Math.floor(Math.random() * 4)]);
  }
};
