# Neighborhood Map Project

## Essential Skills Used:
- API requests
- data-binding using knockout
- Interactive search and navigation menu
- Extensive use of Google Map API functions

## User Interface Introduction
After loading index.html, the webpage shows a map centered near Google's headquarter in Mountain View, CA.
There are five markers on the map, all are great places and are near the center of Googleplex.

When each marker or list is clicked, a window will show up and contain the general information about the
selected location. Also, the New York Times articles window contents will change to articles about the
selected location. (More about opening NYT articles are explained below).

If you click the golden arrow on the left side, a navigation window will slide out. In
the window, a list of all five locations marked on the map is shown.

There is a search bar at the top, where you can type anything to filter the list to the locations you want
to find. The markers on the map will disappear/appear based on the search result too. All filtering happen
in real time when the text is changed in the search bar.

At the bottom of the navigation window, there is a green button you can click to get New York Times articles about current selected location. When you click the "close" button at the top right corner of the articles window, the window will be closed.

## References and Inspiration From
- Udacity courses: Intro to Ajax; Javascript Design Patterns; Google Maps API
- https://developers.google.com/maps/
- https://jquery.com/
- knockoutjs.com
- Daniel Botta https://github.com/dsbotta/Neighborhood-Map
