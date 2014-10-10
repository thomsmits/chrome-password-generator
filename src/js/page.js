/* (c) 2014 Thomas Smits */
/**
 * This script is injected by the extension into the web page to extract data
 * and transfer data back.
 *
 * Due to security restrictions the communication between this script and
 * the extension can only be performed using messages.
 */
$(function() {

    // possible selectors pointing to the form field with the user name;
    // most specific has to be listed first
    var userSelectors = [
        "#Email",
        "#username",
        "#user",
        "#login_field",
        "[name*='email']",
        "[name='login']",
        "[name='login_form[username]']",
        "[name*='login_field']",
        "[name*='username']",
        "[name*='user']"
    ];

    // possible selectors pointing to the form field with the password;
    // most specific has to be listed first
    var passwordSelectors = [
        "[name*='password']",
        "[type='password']"
    ];

    // Retrieve information about the page
    var location = window.location;
    var userField = findElement(userSelectors);
    var passwordField = findElement(passwordSelectors);

    /**
     * Searches a list of selectors to find a specific element.
     *
     * @param selectors selectors to be tested one after the other
     * @returns {jQuery} the found element wrapped as jQuery object
     */
    function findElement(selectors) {
        var i, field;

        for (i = 0; i < selectors.length; i++) {
            field = $(selectors[i]);
            if (field.length) {
                return field;
            }
        }

        // nothing found, return an object with a val() function to
        // mock a jQuery element
        return {
            val: function(x) {
                return "";
            }
        };
    }

    // send data about url and user name to the extension
    chrome.extension.sendMessage(
        {
            url: location,
            user: userField.val()
        }
    );

    // Add a message listener to recieve messages from the extension
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (!sender.tab) {
                userField.val(request.user);
                passwordField.val(request.password);
            }
        });
});