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

/* For the chart part */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/** Fetches the friends data and uses it to create a chart. */
function drawChart() {
  fetch('/friends-data').then(response => response.json())
  .then((cupsPerPerson) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('number', 'Cups');
    Object.keys(cupsPerPerson).forEach((name) => {
      data.addRow([name, cupsPerPerson[name]]);
    });

    const options = {
      'title': 'How many cups of coffee each character drinks during the show',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}

function login() {
    fetch('/login').then(response => response.text()).then((text) => {
        console.log(text);
        if (text == 1) {
            console.log("here");
            document.getElementById("form").style.display="block";
        } else {
            /* hide the comment form if the user is not logged in */
            document.getElementById("form").style.display="none";

            document.getElementById("login-container").innerHTML = text;
        }
    })
}

function createMap() {
    var myLatlng = new google.maps.LatLng(47.662, 12.882);
    var mapOptions = {
        zoom: 4,
        center: myLatlng,
        mapTypeId: 'roadmap'
    };
    const map = new google.maps.Map(
      document.getElementById('map'), mapOptions);

    addLandmark(map, 41.362, 2.147, 'Barcelona',
        'One of my favourites cities after London.');

    addLandmark(map, 44.467, 26.069, 'Bucharest',
        'Capital of Romania and where I go to university.');

    addLandmark(map, 45.128, 26.816, 'Buzau',
        'My small hometown.');

    addLandmark(map, 53.358, -6.242, 'Dublin',
        'My sister lives here.');

    addLandmark(map, 47.082, 15.438, 'Graz',
        'Many of my aunts and uncles live here.');

    addLandmark(map, 51.470, -0.075, 'London',
        'One of my favourite cities, lots of thing to do here.');

    addLandmark(map, 52.356, 4.849, 'Amsterdam',
        'Took part in a student exchange program.');

}

function addLandmark(map, lat, lng, title, description) {
    const marker = new google.maps.Marker(
      {position: {lat: lat, lng: lng}, map: map, title: title});

    const infoWindow = new google.maps.InfoWindow({content: `<h3>${title}</h1>
                     <p style=\"color:black;\">${description}</p>`});
  
    marker.addListener('mouseover', function() { infoWindow.open(map, marker); });
    marker.addListener('mouseout', function() { infoWindow.close(); });
}