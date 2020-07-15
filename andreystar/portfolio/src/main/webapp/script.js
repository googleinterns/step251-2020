function addRandomQuote() {
  const quotes =
      ['Now. Say my name. Heisenberg. You\'re god damn right', 
      'I am the danger.', 
      'You see, but you do not observe.', 
      'There’s a woman lying dead. Perfectly sound analysis but I was hoping you’d go deeper.'];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}
