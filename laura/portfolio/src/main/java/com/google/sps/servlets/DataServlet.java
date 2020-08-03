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
import com.google.gson.Gson;
import java.io.IOException;
import java.text.DateFormat;  
import java.text.SimpleDateFormat; 
import java.util.ArrayList; 
import java.util.Calendar;
import java.util.Date;  
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private static final Gson GSON = new Gson();

  /* doGet is called by the fetch instruction in the JS function 
                called by the html body after loading the page */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery dataQuery = datastore.prepare(new Query("Task").addSort("timestamp"));

    // Get the specified no of comments to be displayed.
    int commLimit = 0;
    try {
      commLimit = Integer.parseInt(request.getParameter("com-limit"));
    } catch (NumberFormatException e) {
      response.setContentType("text/html;");
      response.getWriter().println("Invalid argument for no of comments.");
      return;
    }

    ArrayList<String> comments = new ArrayList<String>();
    for (Entity comEntity : dataQuery.asIterable()) {
      if (comments.size() == commLimit) {
        break;
      }
      comments.add((String) comEntity.getProperty("comment")
                  + "\nSubmitted at: " + (String) comEntity.getProperty("submission-time"));
    }

    response.setContentType("application/json;");
    response.getWriter().println(GSON.toJson(comments));
  }

  /* doPost is called when the user clicks the submit button */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String txt = request.getParameter("comment-input");
    if (txt.length() == 0) {
      response.setContentType("text/html;");
      response.getWriter().println("Enter a non-empty comment.");
      return;
    }

    // Create an entity for the comment and store it
    Entity ent = new Entity("Task");
    ent.setProperty("comment", txt);

    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z"); 
    long currentTime = System.currentTimeMillis(); 
    String strDate = dateFormat.format(new Date(currentTime));  
    ent.setProperty("timestamp", currentTime);
    ent.setProperty("submission-time", strDate);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(ent);
    response.sendRedirect("/index.html");
  }
}
