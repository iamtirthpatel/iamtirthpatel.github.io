(function ($) {

  "use strict";

    // COLOR MODE
    $('.color-mode').click(function(){
        $('.color-mode-icon').toggleClass('active')
        $('body').toggleClass('dark-mode')
    })

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
        if (localStorage.getItem('visitCount')) {
            localStorage.setItem('visitCount', parseInt(localStorage.getItem('visitCount')) + 1);
        } else {
            localStorage.setItem('visitCount', 1);
        }
        $('#visitor-counter').text(localStorage.getItem('visitCount'));
    });

   
    // AJAX Form Submission
    $('#contactForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var formData = $(this).serialize(); // Serialize form data

        $.ajax({
            type: 'POST',
            url: 'send_email.php',
            data: formData,
            success: function(response) {
                $('#formResponse').html('<p>' + response + '</p>'); // Display success message
            },
            error: function() {
                $('#formResponse').html('<p>There was an error sending your message. Please try again later.</p>'); // Display error message
            }
        });
    });

    // Display Today's Date
    $(document).ready(function() {
      var today = new Date();
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var date = today.toLocaleDateString('en-US',options);
      $('#current-date').text(date);
    });

    // Fetch Weather Data (Example using OpenWeatherMap API)
    function fetchWeather() {
        var apiKey = 'd67baa0ae4091585593bfeb67c9560a7'; // Replace with your OpenWeatherMap API key
        var city = 'Kalamazoo, MI'; // Replace with your city
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function(data) {
                var temp = data.main.temp;
                var weather = data.weather[0].description;
                $('#current-weather').text(`Weather in ${city}: ${temp}°C, ${weather}`);
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

})(jQuery);

//<div id="date-weather" class="text-center my-4">
//<p id="current-date"></p>
//<p id="current-weather">Loading weather...</p>
//</div>