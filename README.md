# VAYORA — Travel & Concierge website

A plain HTML, CSS and JavaScript website. No framework, no build step, no
internet connection needed to run it.

## Open it

Double-click `index.html`, or drag it into any browser. Everything is one
scrolling page.

## Put it online

Upload these files to any web host (Netlify, Vercel, Hostinger, cPanel,
GitHub Pages — any of them) keeping the folder structure as it is:

```
index.html
css/styles.css
css/fonts.css
js/script.js
assets/...
```

## Change your WhatsApp number (important)

Open `js/script.js` and edit the first line of the file:

```js
var WHATSAPP_NUMBER = "2340000000000";
```

Use your real number in international format, digits only, no `+`, no spaces.
Example: `2348012345678`.

The booking form and every WhatsApp button on the page use this one number.

## Add your social media links

In `index.html`, find the block that starts with `<div class="socials">` near
the bottom of the file and replace the four `href="#"` values with your real
Instagram, X, Facebook and WhatsApp links.

## Edit the words

All the text lives in `index.html` — headings, services, mission, vision, the
roadmap and the contact details. Search for the words you want to change and
edit them. Refresh the browser to see the result.

## Colours and spacing

All colours, fonts and spacing live in `css/styles.css` at the top of the file
under `:root`. The brand gradient is the `--grad` line.

## What the booking form does

It never stores anything. It opens WhatsApp with the traveller's name, chosen
service, date and message already typed out, ready to send.
