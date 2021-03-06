window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const body = document.querySelector('body');
let voices = window.speechSynthesis.getVoices();
const icon = document.querySelector('i.fa.fa-microphone')
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');
icon.addEventListener('click', () => {
  sound.play();
  dictate();
});

const dictate = () => {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    paragraph.textContent = speechToText;
    speechToText.voice = voices[2];
    if (event.results[0].isFinal) {
      if (speechToText.includes('what is the time')) {
          speak(getTime);
      };

      if (speechToText.includes('translate')) {
       window.open('./accent.html')
      };
      
      if (speechToText.includes('what is today\'s date')) {
          speak(getDate);

      };
      
      if (speechToText.includes('what is the weather in')) {
          getTheWeather(speechToText);
      };

      if (speechToText.includes('change the background colour to') || speechToText.includes('change the background color to')) {
        changeBG(speechToText);
      };

      if(speechToText === 'change the background'){
        changeRGB();
      }

      if(speechToText === 'nothing'){
        speak(nothing);
      }

      if(speechToText.includes('email')){
        speak(okay);
        window.open('./email.html');
      }

      if(speechToText.includes('search Google for')){
        speak(okay);
        searchGoogle(speechToText);
      }

      if(speechToText.includes('search Wikipedia for')){
        speak(okay);
        searchWiki(speechToText);
      }

      if(speechToText.includes('search Amazon for')){
        speak(okay);
        searchAmazon(speechToText);
      }

      if(speechToText.includes('search Flipkart for')){
        speak(okay);
        searchFlipkart(speechToText);
      }

      if(speechToText.includes('search YouTube for')){
        speak(okay);
        searchYouTube(speechToText);
      }

      if(speechToText.includes('open')){
        speak(okay);
        openSite(speechToText);
      }
    }
  }
}

const speak = (action) => {
  utterThis = new SpeechSynthesisUtterance(action());
  synth.speak(utterThis);
};


const changeBG = (speech) => {
  let colorString = speech.split(' ')[5];
  body.style.background = colorString;
}


const changeRGB = () => {
  const first = getRandomRGB();
	const second = getRandomRGB();
	const third = getRandomRGB();
  const colorString = `rgb(${first}, ${second}, ${third})`;
  body.style.background = colorString;
}

const getRandomRGB = () => {
	return Math.floor(Math.random() * 256);
}

const getTime = () => {
  const time = new Date(Date.now());
  return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const nothing = () =>  {
  return 'Sure Let\'s Move On';
}

const getDate = () => {
  const time = new Date(Date.now());
  return `today is ${time.toLocaleDateString()}`;
};

const okay = () => {
  return 'Sure';
}

const searchGoogle = (speech) => {
  let word = speech.slice(18);
  return window.open(`https://www.google.com/search?q=${word}`);
}

const searchYouTube = (speech) => {
  let word = speech.slice(18);
  return window.open(`https://www.youtube.com/results?search_query=${word}`);
}

const searchFlipkart = (speech) => {
  let word = speech.slice(20);
  return window.open(`https://www.flipkart.com/search?q=${word}`);
}

const searchAmazon = (speech) => {
  let word = speech.slice(18);
  return window.open(`https://www.amazon.in/s?k=${word}`);
}

const searchWiki = (speech) => {
  let query = speech.slice(20);
  return window.open(`https://en.wikipedia.org/wiki/${query}`)
}

const openSite = (speech) => {
  let query = speech.slice(5);
  return window.open(`http://${query}`)
}

const getTheWeather = (speech) => {
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`) 
  .then(function(response){
    return response.json();
  })
  .then(function(weather){
    if (weather.cod === '404') {
      utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
      synth.speak(utterThis);
      return;
    }
    utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
    synth.speak(utterThis);
  });
};