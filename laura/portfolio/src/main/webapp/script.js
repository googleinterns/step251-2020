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

function randomMood() {
  // Pick a random index.
  const idx = Math.floor(Math.random() * 4) + 1;

  const imgUrl = "images/q" + idx + ".jpg";

  // Create the image element.
  const imgElement = document.createElement('img');
  imgElement.src = imgUrl;
  imgElement.height = "500";

  // Put it in a container.
  const imageContainer = document.getElementById('mood-container');
  imageContainer.innerHTML = '';
  imageContainer.appendChild(imgElement);
}

function showGallery() {
    const gallery = document.getElementById('gallery-container');
    for (var i = 0; i < 8; ++ i) {
        /* Add each picture to gallery by creating indep elements */
        const imgElem = document.createElement('img');
        imgElem.src = "images/film/"+i+".jpg";
        imgElem.height = "150";
        imgElem.style = "margin: 40px;";
        
        gallery.appendChild(imgElem);
    }
}

/* Comments */
/* Create new element with the messages recieved from the ./data servlet in a json;
     is called when the page is reloaded by the _onload_ prop of the html body */
async function printServletMsg() {
    const limit = document.getElementById('max-comments-limit').value;
    const response = await fetch("/data?com-limit=" + limit);
    const parsed_json = await response.json();
    
    const comment_zone = document.getElementById('servlet-msg');
    comment_zone.innerHTML = "";
    for (comm of parsed_json) {
        const elem = document.createElement('p');
        elem.innerText = comm;
        elem.classList.add("comment-zone");
        comment_zone.appendChild(elem);
    }

    if (comment_zone.innerHTML == "") {
        comment_zone.innerHTML = "<p class=\"comment-zone\">No comments to display :(. Be the first one to leave a comment!</p>";
    }
}

async function deleteAllComments() {
    await fetch(new Request('/delete-data', {method: 'POST'}));
    await printServletMsg();
}

/* Maps */

async function loadMap () {
    const response = await fetch('/map2019');
    const json = await response.json();

    const map = new google.maps.Map(
        document.getElementById('map'),
        {center: {lat: 44.43, lng: 26.10}, zoom: 3});

    json.forEach(elem => {
        createMarker(map, elem.name, {lat: elem.lat, lng: elem.lng}, elem.description)});
}

function createMarker (map, name, pos, description) {
    var marker = new google.maps.Marker({position: pos, map: map, title: name});
    var window = new google.maps.InfoWindow({content: `<h1>${name}</h1> <p style=\"color:black;\">${description}</p>`});

    marker.addListener('mouseover', function() { window.open(map, marker); });
    marker.addListener('mouseout', function() { window.close(); });
}

/* Charts */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
    const json = await fetch('/chart');
    const freqArray = await json.json();

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Cereal');
    data.addColumn('number', 'Times picked');

    data.addRows(  [['Corn Flakes', freqArray[0]],
                    ['Lucky Charms', freqArray[1]],
                    ['Cinnamon Toast Crunch', freqArray[2]],
                    ['Cheerios', freqArray[3]]]);

    const options = {
        'title': 'Favourite cereals'
    };

    const chart = new google.visualization.PieChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
}