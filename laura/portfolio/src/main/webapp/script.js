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
        
        gallery.appendChild(imgElem);
    }
}

/* Create new element with the msg from the ./data servlet*/
async function printServletMsg() {
    const response = await fetch("/data");
    const txt = await response.text();
    document.getElementById('servlet-msg').innerHTML = "<h1>"+txt+"</h1>";
}