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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import java.io.IOException;
import java.util.ArrayList;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/map2019")
public class MapServlet extends HttpServlet {
    private class Pin {
        String name, description;
        double lat, lng;

        public Pin(String _name, double _lat, double _lng, String _desc) {
            name = _name; lat = _lat; lng = _lng; description = _desc;
        }
    };

    /* doGet is called by the fetch instruction in the JS function 
                called by the html body after loading the page */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ArrayList<Pin> pins = new ArrayList<Pin>();
        pins.add(new Pin("Bucharest", 44.43, 26.10, "I live here."));
        pins.add(new Pin("Oxford", 51, -1, "I study here."));
        
        response.setContentType("application/json;");
        response.getWriter().println(toJsonUsingGson(pins));
    }

    private String toJsonUsingGson (Object obj) {
        Gson gson = new Gson();
        return gson.toJson(obj);
    }
}
