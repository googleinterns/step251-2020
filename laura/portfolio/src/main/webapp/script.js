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
 * Adds a random image to the page.
 */
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

function loadMap () {
    const BUH = {lat: 44.43, lng: 26.10};
    const map = new google.maps.Map(
        document.getElementById('map'),
        {center: BUH, zoom: 3});

    var BUHmarker = createMarker(map, 'Bucharest, Romania', BUH, 'I live here since 2000!');
    const CONmarker = createMarker(map, 'Constanta, Romania', {lat: 44.163818, lng: 28.633451}, 'Attended a music festival.');
    const OXFmarker = createMarker(map, 'Oxford, UK', {lat: 51.752490, lng: -1.251908}, 'I study here.');
    const VDImarker = createMarker(map, 'Val d\'Isere, France', {lat: 45.446212, lng: 6.977692}, 'I went skiing.');
    const ZRHmarker = createMarker(map, 'Zurich, Switzerland', {lat: 47.375978, lng: 8.541283}, 'Visited some friends.');
    const Bakumarker = createMarker(map, 'Baku, Azerbaijan', {lat: 40.407327, lng: 49.854926}, 'I took part in IOI!');
    const Bratmarker = createMarker(map, 'Bratislava, Slovakia', {lat: 48.140940, lng: 17.103918}, 'Central European Olympiad');
    const STKmarker = createMarker(map, 'Stockholm, Sweden',{lat: 59.324801, lng: 18.068571}, 'A city I wanted to visit for some time. Formed from 14 islands!');
    const DOHmarker = createMarker(map, 'Doha, Qatar', {lat: 25.287784, lng: 51.530633}, 'One of the most impressive, unique and richest cities I\'ve seen! And hottest weather!');
}

function createMarker (map, name, pos, description) {
    var marker = new google.maps.Marker({position: pos, map: map, title: name});
    var window = new google.maps.InfoWindow({content: '<h1>' + name + '</h1>' +
                        '<p style=\"color:black;\">' + description + '</p>'});

    marker.addListener('mouseover', function() { window.open(map, marker); });
    marker.addListener('mouseout', function() { window.close(); });

    return {marker, window};
}