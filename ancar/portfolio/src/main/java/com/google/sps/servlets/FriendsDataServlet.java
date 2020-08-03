package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns the data as a JSON object, e.g. {"Rachel": 52, "Monica": 34}] */
@WebServlet("/friends-data")
public class FriendsDataServlet extends HttpServlet {

  private LinkedHashMap<String, Integer> cupsPerPerson = new LinkedHashMap<>();

  @Override
  public void init() {
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(
        "/WEB-INF/cups-per-person.csv"));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      String name = String.valueOf(cells[0]);
      Integer cups = Integer.valueOf(cells[1]);

      cupsPerPerson.put(name, cups);
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(cupsPerPerson);
    response.getWriter().println(json);
  }
}