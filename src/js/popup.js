/* (c) 2014 Thomas Smits */

/*
  JavaScript belonging to the popup HTML page. The script is loaded
  via the page (alternatively it could be loaded using the manifest
  if no HTML page is needed).

  It requires JQuery and crypto libraries, which have been loaded by
  the popup.html page already.
 */
$(function () {

    // Inject two scripts into the current tab. These scripts are needed
    // to read URL and username and write the password back later on.
    chrome.tabs.executeScript( { file: 'js/jquery-2.1.1.js' } );
    chrome.tabs.executeScript( { file: 'js/page.js' } );

    // Register event handlers to the input fields to allow for
    // sending the data by pressing the return key.
    $("#password").keyup(function(event) {
        detectEnter(event);
    });

    $("#user").keyup(function(event) {
        detectEnter(event);
    });

    $("#site").keyup(function(event) {
        detectEnter(event);
    });

    // Register the event handler for the submit button.
    $("#submit").click( function(event) {
        doIt();
    });

    // Register a message listener that receives the data provided by the script
    // loaded into the page (page.js). Due to the security constraints of the
    // browser, the extension and page scripts can only communicate via messages.
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (sender.tab) {
            // Message is from the page script
            $("#site").val(shortenHostname(request.url.hostname));
            $("#user").val(request.user);
        }
    });

    /**
     * Function to calculate a password from the form data and send it back to
     * the page.
     */
    function doIt() {

        // read form data
        var password = $("#password").val().trim();
        var site     = $("#site").val().trim();
        var user     = $("#user").val().trim();

        // base string to calculate all passwords
        var input = password + site  + user;

        // calculate the resulting password
        // var result = md5(input, 10);
        var result = pbkdf2(password + site + user, site, 10);

        result = result + '.' + site.length;

        // write password to the form
        $("#result").val(result).focus().select();

        // send password to the page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,
                {
                    user: user ,
                    password: result
                });
        });
    }

    /**
     * Function that is attached to the input fields. It performs the password
     * calculation in case return is pressed.
     *
     * @param event the keyboard event
     */
    function detectEnter(event) {
        if (event.keyCode === 13) {
            doIt();
        }
    }

    /**
     * Encode a given binary input into a ascii representation.
     * This function basically performs a Base64 encoding but
     * removes some special chars and replaces characters that
     * can be easily confused (l 1, O 0) with others.
     *
     * @param input the binary input
     * @param length length of the resulting password
     * @returns {string} the string representation.
     */
    function encodeAscii(input, length) {
        var base64 = CryptoJS.enc.Base64.stringify(input);
        return base64.replace(/\//g, 'x')
            .replace(/=/g, '')
            .replace(/\+/g, 'y')
            .replace(/l/g, 'L')
            .replace(/0/g, 'O')
            .substring(0, length);
    }

    /**
     * Generate an MD5 based password.
     *
     * @param input the input string, i.e. the base password
     * @param length length of the resulting password
     * @returns {string} the MD5 based password
     */
    function md5(input, length) {
        return encodeAscii(CryptoJS.MD5(input), length);
    }

    /**
     * Generate an PBKDF2 (password based key derivation function) based password.
     *
     * @param input the input string, i.e. the base password
     * @param salt an additional salt
     * @param length length of the resulting password
     * @returns {string} the PBKDF2 based password
     */
    function pbkdf2(input, salt, length) {
        return encodeAscii(CryptoJS.PBKDF2(input, salt), length);
    }

    /**
     * Function to shorten the host names for the password
     * generation.
     *
     * @param {string} hostname the host name
     * @returns {string} the shortened host name
     */
    function shortenHostname(hostname) {
        var match = hostname.match(/(.*?)\.(.*?)\.(.*?)$/);

        if (match) {
            return match[2] + '.' + match[3];
        }

        return hostname;
    }
});
