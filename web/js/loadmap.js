var map;
var infowindow = new google.maps.InfoWindow();
var place;
var autocomplete;

function initialization() {
    showAllReports();
    initAutocomplete();
}

function showAllReports() {
    $.ajax({
        url: 'HttpServlet',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(reports) {
            mapInitialization(reports);
        },
        error: function(xhr, status, error) {
            alert("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
}

function mapInitialization(reports) {
    var mapOptions = {
        mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
    };

    // Render the map within the empty div
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var bounds = new google.maps.LatLngBounds ();

    $.each(reports, function(i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        var latlng = new google.maps.LatLng(lat, long);
        var reportType = String(e['report_type']);

        bounds.extend(latlng);

        // Create the infoWindow content
        var contentStr = '<h4>Report Details</h4><hr>';
        contentStr += '<p><b>' + 'Disaster' + ':</b>&nbsp' + e['disaster'] + '</p>';
        contentStr += '<p><b>' + 'Report Type' + ':</b>&nbsp' + e['report_type'] +
            '</p>';
        if (e['report_type'] == 'request' || e['report_type'] == 'donation') {
            contentStr += '<p><b>' + 'Resource Type' + ':</b>&nbsp' +
                e['resource_type'] + '</p>';
        }
        else if (e['report_type'] == 'damage') {
            contentStr += '<p><b>' + 'Damage Type' + ':</b>&nbsp' + e['damage_type']
                + '</p>';
        }
        contentStr += '<p><b>' + 'Timestamp' + ':</b>&nbsp' +
            e['time_stamp'].substring(0,19) + '</p>';
        if ('message' in e){
            contentStr += '<p><b>' + 'Message' + ':</b>&nbsp' + e['message'] + '</p>';
        }
        contentStr += '<p><b>' +'Reporter' + ':</b>&nbsp' + e['first_name'] + ' ' + e['last_name'] + '</p>';

        var icon;
        if (reportType == 'donation'){
            icon = {
                url: "/img/heart.png",
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
        }
        else if (reportType == 'request'){
            icon = {
                url: "/img/sos.png",
                scaledSize: new google.maps.Size(40, 40), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
        }
        else if (reportType == 'damage'){
            icon = {
                url: "/img/spam.png",
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
        }

        // Create the marker
        var marker = new google.maps.Marker({ // Set the marker
            position : latlng, // Position marker to coordinates
            map : map, // assign the market to our map variable
            customInfo: contentStr,
            icon: icon
        });

        // Add a Click Listener to the marker
        google.maps.event.addListener(marker, 'click', function() {
            // use 'customInfo' to customize infoWindow
            infowindow.setContent(marker['customInfo']);
            infowindow.open(map, marker); // Open InfoWindow
        });

    });

    map.fitBounds (bounds);

}

function initAutocomplete() {
    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(document
        .getElementById('autocomplete'));

    // When the user selects an address from the dropdown, show the place selected
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    place = autocomplete.getPlace();
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
}

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
