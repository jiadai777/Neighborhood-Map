//set map, markers array, and locations information accessible in global scope
var map;
var markers = [];
var locations = [{
    title: "Google Headquarter",
    location: {
        lat: 37.42204878,
        lng: -122.08405316
    },
    streetAddress: "1600 Amphitheatre Pkwy",
    cityAddress: "Mountain View, CA 94043",
    url: "www.google.com",
    isVisible: true,
    id: "nav0"
}, {
    title: "Costco Wholesale",
    location: {
        lat: 37.42095813,
        lng: -122.09574223
    },
    streetAddress: "1000 N Rengstorff Ave",
    cityAddress: "Mountain View, CA 94043",
    url: "www.costco.com",
    isVisible: true,
    id: "nav1"
}, {
    title: "LinkedIn",
    location: {
        lat: 37.42327574,
        lng: -122.07055092
    },
    streetAddress: "2029 Stierlin Ct",
    cityAddress: "Mountain View, CA 94043",
    url: "www.linkedin.com",
    isVisible: true,
    id: "nav2"
}, {
    title: "Century Cinema 16",
    location: {
        lat: 37.414438,
        lng: -122.081130
    },
    streetAddress: "1500 N Shoreline Blvd",
    cityAddress: "Mountain View, CA 94043",
    url: "www.cinemark.com/theatre-399",
    isVisible: true,
    id: "nav3"
}, {
    title: "Computer History Museum",
    location: {
        lat: 37.414200,
        lng: -122.077396
    },
    streetAddress: "1401 N Shoreline Blvd",
    cityAddress: "Mountain View, CA 94043",
    url: "www.computerhistory.org",
    isVisible: true,
    id: "nav4"
}];

//initialize the map: set google map as ground, create all markers, show them,
//renter navigation menu and wikipedia information menu
function initMap() {
    var mapAttr = {
        center: new google.maps.LatLng(37.419268, -122.078694),
        zoom: 13,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), mapAttr);

    createMarkers(locations);
    showMarkers();
}

function createMarkers(locations) {
    var infoWindow = new google.maps.InfoWindow();
    //create an array of markers using the information from locations array
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var streetAddress = locations[i].streetAddress;
        var cityAddress = locations[i].cityAddress;
        var url = locations[i].url;

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            streetAddress: streetAddress,
            cityAddress: cityAddress,
            url: url,
            id: 'nav' + i,
            isVisible: true
        });
        //push the marker to the array of markers.
        markers.push(marker);

        locations[i].holdMarker = marker;
        //Create an onclick event to open an infowindow for at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
        //Create click event to open an infowindow when a list in the nav is clicked.
        var locationID = $('#nav' + i);
        locationID.click((function(marker, i) {
            return function() {
                populateInfoWindow(marker, infoWindow);
            };
        })(marker, i));
    }
}

function populateInfoWindow(marker, infoWindow) {
    //Check to make sure the infoWindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;

        //make a marker bouncing for 2 seconds when clicked
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 2400);
        //create the contents in an infowindow
        var infoContent = '<br><hr style="margin-bottom: 5px"><strong>' +
            marker.title + '</strong><br><p>' +
            marker.streetAddress + '<br>' +
            marker.cityAddress + '<br></p><a class="web-links" href="http://' + marker.url +
            '" target="_blank">' + marker.url + '</a>';

        infoWindow.setContent(infoContent);

        infoWindow.open(map, marker);
        //zoom in the marker when it is clicked and infowindow is open
        map.setZoom(16);
        map.setCenter(marker.position);
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });

    }
}

function showMarkers() {
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < locations.length; i++) {
        //check if markers should be shown based on visibility change from the
        //search filter results
        if (locations[i].isVisible === true) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
    setBounds();
}

//set boundaries of google map based on markers positions
function setBounds() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
    }
}

//bound the text content in the search bar and filter the list view simutaneously
//also change the visibility of markers corresponding the the filtered list
var viewModel = {
    search : ko.observable('')
};

viewModel.locations = ko.computed(function() {
    var self = this;
    var filter = self.search().toLowerCase();

    return ko.utils.arrayFilter(locations, function(location) {
      var visible = location.title.toLowerCase().indexOf(filter) >= 0; // returns true or false
      location.isVisible = visible;
      return visible;
    });
}, viewModel);

ko.applyBindings(viewModel);

//open navigation window by setting its width to 340px
//also change the arrow direction and it becomes a close button
function openNav() {
    document.getElementById("nav-window").style.width = "340px";
    document.getElementById("arrow-container").style.marginLeft = "340px";
    document.getElementById("map").style.left = "340px";
    $("#arrow").attr("src", "img/leftArrow.gif");
    $("#arrow-container").attr("onclick", "closeNav()");
}

//open the wiki and NY Times window by setting its height to 400 px
function openInfo() {
    document.getElementById("info-container").style.height = "400px";
}

//close navigation window by setting its width to 0
//also change arrow direction and it becomes a open nav button
function closeNav() {
    document.getElementById("nav-window").style.width = "0";
    document.getElementById("arrow-container").style.marginLeft = "0";
    document.getElementById("map").style.left = "0px";
    $("#arrow").attr("src", "img/rightArrow.gif");
    $("#arrow-container").attr("onclick", "openNav()");
}

//close the wiki and NY Times window by setting its height to 0 px
function closeInfo() {
    document.getElementById("info-container").style.height = "0px";
}

var nytArticles = ko.observableArray([]);
//Load information from Wikipedia and New York Times about Google
function loadData () {



    //New York Times json request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=google&sort=newest&api-key=cc0410895ee04c63874f1fca9596939d'
    $.getJSON(nytimesUrl, function(data) {

        articles = data.response.docs;

        for (var i = 0; i < articles.length; i++) {
            nytArticles.push(articles[i]);
        };
    }).fail(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    return false;
};
