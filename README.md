# Chrome Password Generator

## Purpose

A Chrome extension to generate passwords for sites based on a base password, the user name and the site's domain.

The basic idea is that the user has only one strong password and can use this on all sites in the internet. Due to the fact that today passwords are stolen regularly and some sites do not even hash their users passwords sufficiently, you cannot use your password on different sites. Once it is stolen from one site, the attacker can use it on any site.
 
To solve this problem, this Chrome extension uses a password based key derivation function to calculate unique passwords for every site taking into account, the user name, the site name and the base password. Because of the cryptographic function applied to the password, an attacker cannot calculate the base password from the password calculated by this extension.

The generated password has a length of 12 to 13 characters. The password consists of the generated key (10 characters), a dot (`.`) and the length of the domain name as integer, e.g. `OKL2maMGKh.12` for a site with 12 characters in its name. The dot and length was included to fulfill stupid password policies that request numbers and special characters.

## Usage

Install the extension into the Chrome browser using the URL [chrome://extensions](chrome://extensions). Be sure to enable the developer mode. The extension can then be loaded into the browser.


## Limitations

The length of the password and the algorithm are hard coded in the extension. Also the selectors to find the username and password on the HTML page of the website. This limitation may be removed in future versions. To change the length of the resulting password or the algorithm, you have to edit the `js/page.js` file. 


# Used Software and Components

This software includes components from 

  * [crypto-js](https://code.google.com/p/crypto-js/) licensed under the new BSD license 
  * [jQuery](www.jquery.com) licensed under the MIT license

The icons are taken from the [Gnome project](http://www.gnome.org/).
