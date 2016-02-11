(function() {
    "use strict";
    angular.module("gym.directive", [])
    .directive("gFocusNextOnEnter", function() {
        return {
            restrict: "A",
            link: function($scope, elem, attrs) {
                elem.bind("keydown", function(e) {
                    var focusables = $("input:visible,button:visible");
                    var code = e.keyCode || e.which;
                    if (code === 13) {
                        var current = focusables.index(this);
                        var next = focusables.eq(current + 1);
                        next = next.length ? next : focusables.eq(0);
                        next.focus();
                        e.preventDefault();
                    }
                });
            }
        };
    })
    .directive("gCurrentTime", ['$interval', 'dateFilter', function($interval, dateFilter) {
        
        function link(scope, element, attrs) {
            var format, 
            timeoutId;
            
            function updateTime() {
                element.text(dateFilter(new Date(), format));
            }
            
            scope.$watch(attrs.gCurrentTime, function(value) {
                format = value;
                updateTime();
            });
            
            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });
            
            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
                updateTime();
                // update DOM
            }, 1000);
        }
        
        return {
            link: link
        };
    }
    ])
    .directive("gWeather", ['$interval', 'weatherService', 'tools', function($interval, weatherService, tools) {
        
        function link(scope, element, attrs) {
            var timeoutId;
            var weatherImgUrlTemplate = 'http://openweathermap.org/img/w/{0}.png';
            var weatherImgUrl = '';

            update();
            
            function update() {
                weatherService.getCurrentWeather(function getCurrentWeatherCallback(weatherData){
                    console.log(weatherData);
                    var weather = weatherData.weather.length && weatherData.weather[0];
                    if (weather) {
                        weatherImgUrl = weatherImgUrlTemplate.replace(/\{0\}/i, weather.icon);
                    }
                    var temp = weatherData.main.temp-273.15;
                    element.html(tools.formatStr('<span>{0} °C</span>', temp));
                });
            }
            
            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });
            
            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
                update();
                // update DOM
            }, 600000);
        }
        
        return {
            link: link
        };
    }
    ]);
})();
