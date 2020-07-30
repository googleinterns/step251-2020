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

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/chart")
public class ChartServlet extends HttpServlet {
    private int[] frequency = {0,0,0,0,0};
    private static final Gson GSON = new Gson();

    public void doPost (HttpServletRequest request, HttpServletResponse response) throws IOException {
        int pickedNmb = Integer.parseInt(request.getParameter("picked-cereal"));
        frequency[pickedNmb] ++;
        response.sendRedirect("/index.html");
    }
    
    /* doGet is called by the fetch instruction in the JS function 
                called by the html body after loading the page */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;");
        response.getWriter().println(GSON.toJson(frequency));
    }
}
