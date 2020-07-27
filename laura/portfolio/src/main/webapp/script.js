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

    const BUHmarker = new google.maps.Marker({position: BUH, map: map, title: 'Hometown'});
    const CONmarker = new google.maps.Marker({position: {lat: 44.163818, lng: 28.633451}, map: map, title: 'Constanta'});
    const OXFmarker = new google.maps.Marker({position: {lat: 51.752490, lng: -1.251908}, map: map, title: 'Uni'});
    const VDImarker = new google.maps.Marker({position: {lat: 45.446212, lng: 6.977692}, map: map, title: 'Val d\'Isere'});
    const ZRHmarker = new google.maps.Marker({position: {lat: 47.375978, lng: 8.541283}, map: map, title: 'Zurich'});
    const Bakumarker = new google.maps.Marker({position: {lat: 40.407327, lng: 49.854926}, map: map, title: 'Baku'});
    const Bratmarker = new google.maps.Marker({position: {lat: 48.140940, lng: 17.103918}, map: map, title: 'Bratislava'});
    const STKmarker = new google.maps.Marker({position: {lat: 59.324801, lng: 18.068571}, map: map, title: 'Stockholm'});
    const DOHmarker = new google.maps.Marker({position: {lat: 25.287784, lng: 51.530633}, map: map, title: 'Doha'});
}