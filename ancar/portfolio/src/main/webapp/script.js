// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random quote to the page.
 */
function addRandomQuote() {
  const quotes =
      ['Pivot!', 'We were on a break!', 'How you doing?', 'She is your lobster.', 'Seven!'];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

function happyFeel() {
    const happyContainer = document.getElementById('happy-container');
    happyContainer.innerText = "If you are happy and you know it, clap your hands!";
}

function sadFeel() {
    const sadContainer = document.getElementById('sad-container');
    sadContainer.innerText = "Check out my gallery with pictures of Sasha! If they do not make you feel better, click again.";
}

function angryFeel() {
    const angryContainer = document.getElementById('angry-container');
    angryContainer.innerText = "Breathe in, breathe out!";
}


