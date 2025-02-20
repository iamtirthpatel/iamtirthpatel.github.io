(function ($) {

  "use strict";

    // COLOR MODE
    $(document).ready(function() {
        // Apply dark mode by default
        $('body').addClass('dark-mode');
        $('.color-mode-icon').addClass('active');

        // Toggle dark mode on button click
        $('.color-mode').click(function(){
            $('.color-mode-icon').toggleClass('active');
            $('body').toggleClass('dark-mode');
        });
    });

    // HEADER
    $(".navbar").headroom();

    // PROJECT CAROUSEL
    $('.owl-carousel').owlCarousel({
    	items: 1,
	    loop:true,
	    margin:10,
	    nav:true
	});

    // SMOOTHSCROLL
    $(function() {
      $('.nav-link, .custom-btn-link').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });  

    // TOOLTIP
    $('.social-links a').tooltip();

    // VISITOR COUNTER
    $(document).ready(function() {
        const database = firebase.database();
        const visitorCountRef = database.ref('visitorCount');

        visitorCountRef.transaction(function(currentCount) {
            return (currentCount || 0) + 1;
        }).then(function(snapshot) {
            $('#visitor-counter').text(snapshot.snapshot.val());
        }).catch(function(error) {
            console.log('Error updating visitor count:', error);
        });
    });

   
    // AJAX Form Submission
    $('#contactForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var formData = $(this).serialize(); // Serialize form data

        $.ajax({
            type: 'POST',
            url: 'https://formspree.io/f/mdkadyal', // Replace with your Formspree form ID
            data: formData,
            dataType: 'json',
            success: function(response) {
                $('#formResponse').html('<p>Thank you for your message. We will get back to you soon!</p>'); // Display success message
            },
            error: function() {
                $('#formResponse').html('<p>There was an error sending your message. Please try again later.</p>'); // Display error message
            }
        });
    });

    // Display Today's Date
    $(document).ready(function() {
      var today = new Date();
      var options = {year: 'numeric', month: 'short', day: 'numeric' };
      var date = today.toLocaleDateString('en-US',options);
      $('#current-date').text(date);
    });

    // Fetch Weather Data (Example using OpenWeatherMap API)
    function fetchWeather() {
        var apiKey = '97bc4d4e202b0685b65fa60e1e3e8897'; // Ensure this is your valid API key
        var city = 'Kalamazoo, US'; // Ensure this is the correct city
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        console.log("Fetching weather data from URL:", url); // Log the URL for debugging

        $.getJSON(url)
            .done(function(data) {
                console.log("Weather data received:", data); // Log the received data
                var temp = Math.round(data.main.temp);
                var weather = data.weather[0].description;
                var humidity = data.main.humidity;
                var windSpeed = data.wind.speed;
                var icon = data.weather[0].icon;
                

                $('#current-weather').html(`
                    
                    ${city}: ${temp}°C<img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weather}">
                    
                `);
            })
            .fail(function(jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
                $('#current-weather').text('Unable to fetch weather data.');
            });
    }

    

    $(document).ready(function() {
        fetchWeather();
    });

    

    // Function to fetch top tracks
    async function fetchTopTracks(accessToken) {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log('Top Tracks Data:', data); // Log the data for debugging
            const topTracksElement = document.getElementById('current-track');
            topTracksElement.innerHTML = ''; // Clear existing content

            if (data && data.items) {
                data.items.forEach(track => {
                    const albumImage = track.album.images[0].url;
                    const trackElement = document.createElement('div');
                    trackElement.innerHTML = `
                        <img src="${albumImage}" alt="Album Art">
                        <span>${track.name} by ${track.artists.map(artist => artist.name).join(', ')}</span>
                    `;
                    topTracksElement.appendChild(trackElement);
                });
            } else {
                topTracksElement.innerText = 'No top tracks available.';
            }
        } catch (error) {
            console.error('Error fetching top tracks:', error);
        }
    }

    // Function to fetch playlists
    async function fetchPlaylists(accessToken) {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            const playlistContainer = document.getElementById('playlists');
            playlistContainer.innerHTML = '';
            data.items.forEach(playlist => {
                const playlistImage = playlist.images.length ? playlist.images[0].url : 'default-image-url'; // Use a default image if none exists
                const playlistElement = document.createElement('div');
                playlistElement.innerHTML = `
                    <img src="${playlistImage}" alt="Playlist Art">
                    <span>${playlist.name}</span>
                `;
                playlistElement.onclick = () => window.open(playlist.external_urls.spotify, '_blank');
                playlistContainer.appendChild(playlistElement);
            });
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    }

    // Call these functions with your new access token
    const accessToken = ''; // Replace with your new access token
    fetchTopTracks(accessToken);
    fetchPlaylists(accessToken);

})(jQuery);

//<div id="date-weather" class="text-center my-4">
//<p id="current-date"></p>
//<p id="current-weather">Loading weather...</p>
//</div>