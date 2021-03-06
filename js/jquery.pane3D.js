if ( Modernizr.csstransforms ) {

  (function( $ ) {

    //Declare plugin
    $.fn.pane3D = function( options ) {

      //Extend options
      var o = $.extend({
        onLevelChange: function() {},
        perspective: 400,
        perspectiveOrigin: "center",
        spacing: 1000
      }, options);

      //Vars
      var $env = this,
          $panesContainer = this.find(".panes-container"),
          $panes = $panesContainer.find(".pane"),
          $w = $(window),
          scrolled  = 0,
          docHeight,
          distance3d = o.spacing,
          levels = $panes.size() - 1, //0 based
          depthPositioning = distance3d * levels,
          depth3D = (distance3d * (levels+1)),
          docHeight = depth3D,
          previousLevel = 0,
          currentLevel = 0;

      //First create the empty div that will allow the scrolling
      $("body").append("<div id='scroller' style='height: " + depth3D + "px;'></div>");

      //Setup 3D structure
      $env.css({
        "-webkit-perspective": o.perspective,
        "-webkit-perspective-origin": o.perspectiveOrigin,
        "-moz-perspective": o.perspective,
        "-moz-perspective-origin": o.perspectiveOrigin,
        "perspective": o.perspective,
        "perspective-origin": o.perspectiveOrigin,
        "position": "fixed",
        "height": "100%",
        "width": "100%"
      }).addClass("pane3D-activated");
      $panesContainer.css({
        "-webkit-transform-style": "preserve-3d",
        "-moz-transform-style": "preserve-3d",
        "transform-style": "preserve-3d",
        "-webkit-transform": "translate3d( 0, 0, -" + depthPositioning + "px )",
        "-moz-transform": "translate3d( 0, 0, -" + depthPositioning + "px )",
        "transform": "translate3d( 0, 0, -" + depthPositioning + "px )",
        "height": "100%",
        "width": "100%"
      });
      $panes.each(function(i){
        $(this).css({
          "-webkit-transform": "translate3d( 0, 0, " + (depthPositioning - (distance3d * i)) + "px )",
          "-moz-transform": "translate3d( 0, 0, " + (depthPositioning - (distance3d * i)) + "px )",
          "transform": "translate3d( 0, 0, " + (depthPositioning - (distance3d * i)) + "px )",
          "position": "absolute"
        });
      });


      //Bind Functionality on scroll event
      $(window).scroll(function(){
        //normalize scroll value from 0 to 1
        scrolled = ( $w.scrollTop() / (docHeight - $w.height()) )-1;

        var scale = Math.pow(3, scrolled * levels),
            zoom3d = ( scrolled * levels * distance3d ),
            transformValue = (Modernizr.csstransforms3d)?'translate3d(0px, 0px, ' + zoom3d + 'px)':'scale(' + scale + ')';

        //Apply transformation
        $panesContainer.css({
          "-webkit-transform": transformValue,
          "-moz-transform": transformValue,
          "-ms-transform": transformValue,
          "-o-transform": transformValue,
          "transform": transformValue
        });

        //Change level
        currentLevel = (Modernizr.csstransforms3d)?
        (Math.round( scrolled * levels ) + levels):
        (Math.round( scrolled * levels ));

        //Run level change callback function
        if ( currentLevel != previousLevel) {
          o.onLevelChange.call( $panes[currentLevel] );
          previousLevel = currentLevel;
        }

      });

      return this;

    };


  }( jQuery ));

}