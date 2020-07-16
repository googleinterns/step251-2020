function addRandomQuote() {
  const quotes = [
    `Now. Say my name. Heisenberg. You're god damn right`,
    'I am the danger.',
    'You see, but you do not observe.',
    'There’s a woman lying dead. Perfectly sound analysis but I was hoping you’d go deeper.',
    `You're treading on some mighty thin ice here.`
  ];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

// Image gallery
const imageSources = [
  'senya-gorgeous.jpg',
  'senya-superman.jpg',
  'senya-dissapointed.jpg'
];
let catImage;
let imageSelector;

function setPhoto() {
  for (let selector of imageSelector) {
    if (selector.checked) {
      catImage.src = 'images/' + imageSources[selector.value];
      break;
    }
  }
}

window.onload = function() {
  catImage = document.getElementById('cat-photo');
  imageSelector = document.getElementsByName('cat-photo-id');
  for (let selector of imageSelector) {
    selector.onchange = setPhoto;
  }
  setPhoto();
}