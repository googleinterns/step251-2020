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

function feel(mood) {
    const feelContainer = document.getElementById('feel-container');

    if (mood == 'happy') {
        feelContainer.innerText = "If you are happy and you know it, clap your hands!";
    }

    if (mood == 'sad') {
        feelContainer.innerText = "Check out my gallery with pictures of Sasha! If they do not make you feel better, click again.";
    }

    if (mood == 'angry') {
        feelContainer.innerText = "Breathe in, breathe out!";
    }
}

function chooseAge(age) {
    const ageContainer = document.getElementById('age-container');
    if (age == 19 || age == 20){
        ageContainer.innerText = "You are wrong!";
    }
    else {
        ageContainer.innerText = "You are correct!";
    }
}

function getComments() {
    var x = document.getElementById("mySelect").value;
    fetch('/data?value=' + x).then(response => response.json()).then((comments) => {
      const commentDiv = document.getElementById('comments-container');
      commentDiv.innerHTML = "";
      for (element of comments) {
        const paragraph = document.createElement('p');
        paragraph.innerText = element;
        paragraph.classList.add("commentDiv");
       commentDiv.appendChild(paragraph);
      }

      if (commentDiv.innerHTML == "") {
          commentDiv.innerHTML = "<p>No comments to display.</p>";
      }
    })
}

async function deleteComments() {
    await fetch('/delete-data', {method: 'POST'});
    await getComments();
}


