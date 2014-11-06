/**
 * Plugin Name: SocialTracker
 * Author : Vinay@Pebbleroad
 * Date: 06/11/2014
 * Description: Easily track GA Social Sharing and Custom events with using data-attributes
 */
;(function($, window, undefined){

    /**
     * Process
     * 1. Read values from data attributes
     * 2. Validate values
     * 3. Push to GA
     */
    
     /**
     * For social sharing
     * data-track="social"
     * data-network="facebook"
     * data-action="share|like|tweet"
     * data-href="URL to share"
     */
    

    /**
     * For click tracking
     * data-track="click|*"
     * data-name="Event_name"
     * data-action="click"
     * data-category="Link"
     */



    var defaults = {

        track    : 'click',
        network  : null,
        href     : null,
        action   : 'click',
        name     : null,
        category : null,
        debug    : true

    };

    /**
     * SocialTracker proto
     */
    function SocialTracker(options){

        var self = this

        this.options = $.extend({}, defaults, options)

        return this;

    }

    
    /**
     * Track
     */
    
    SocialTracker.prototype = {
        
        constructor: SocialTracker,

        initialize: function(){

            var self = this

            /**
             * Check tracking type for all elements
             */
            
            $('[data-track]').each(function(){

                var $this = $(this),
                    type = $this.data('track'),
                    e = type == 'social'? 'click': type;

                
                $(this).on(e, function(event){

                    self.track(this, event)

                });                

            });


            
        
        },

        track: function(el, event){

            var self = this,
                el = el,
                $el = $(el),
                data = $.extend({}, this.options, $el.data())                
                event = event || window.event,
                target = event.target || event.srcElement;
            

            switch(data.track){

                /**
                 * Social tracking
                 */
                
                case 'social':

                    /**
                     * Check for href data
                     */
                    
                    if (target.href && data.href){

                        /* Push to GA */

                        _gaq.push(['_trackSocial', data.network, data.action, data.href]);

                        /* Log */

                        self.log({
                            success : true,
                            network : data.network,
                            action  : data.action,
                            href    : data.href
                        })

                        /* Open share dialog */

                        openPopup(target.href, data.name);
                        
                    }else{

                        throw new Error('URL to share is not defined in href or data-href attributes')

                        /* Log */

                        self.log({
                            success : false,
                            network : data.network,
                            action  : data.action,
                            href    : data.href
                        })
                    }

                    /**
                     * Open Share dialog in a new window
                     */
                    
                    event.preventDefault();

                    break;


                case 'click':

                    _gaq.push(['_trackEvent', data.category, data.action, data.name]);

                    /* Log */

                    self.log({
                        success : true,
                        category : data.category,
                        action  : data.action,
                        name    : data.name
                    })
                    
                    break;

            }
        },
        log: function(args){

            if (this.options.debug) {

                if (window.console && window.console.log) {
                    
                    console.log("Social tracker:", args);                    
                }
            }

        }
        
    }


    /**
     * Open popup
     */
    
    function openPopup(href, title){

        var popupWidth= 620,
            popupHeight = 360;
        
        var wLeft = window.screenLeft ? window.screenLeft : window.screenX,
            wTop = window.screenTop ? window.screenTop : window.screenY,
            left = wLeft + (window.innerWidth / 2) - (popupWidth / 2),
            top = wTop + (window.innerHeight / 2) - (popupHeight / 2);

        return window.open(href, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + popupWidth + ', height=' + popupHeight + ', top=' + top + ', left=' + left);

    }

    /**
     * When GA is loaded     
     */
    $(document).on("ready.ga", function () {

        var tracker = new SocialTracker();

        tracker.initialize();

    });
    

})(jQuery, window)