package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns map data as a JSON array, e.g. [{"lat": 38.4404675, "lng": -122.7144313}] */
@WebServlet("/map-data")
public class MapServlet extends HttpServlet {

    private static class ElementMap {
        double lat, lng;
        String name, description;

        public ElementMap(double lat, double lng, String name, String description) {
            this.lat = lat;
            this.lng = lng;
            this.name = name;
            this.description = description;
        }
    }

    private List<ElementMap> markers;
    private static final Gson GSON = new Gson();

    @Override
    public void init() {
        markers = new ArrayList<>();

        try(Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/cities.csv"))) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                String[] cells = line.split(",");

                double lat = Double.parseDouble(cells[0]);
                double lng = Double.parseDouble(cells[1]);

                markers.add(new ElementMap(lat, lng, cells[2], cells[3]));
            }
            scanner.close();
        }
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.getWriter().println(GSON.toJson(markers));
    }
}