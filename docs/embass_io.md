# Embass.io

*Sep 14, 2021*

![Website Screenshot](assets/embass_snap.png)

### Origin Story

During lockdown my friend tried to go to America to work on boats, however, he struggled to find any US embassy appointments as the London branch was closed. He jokingly asked me "Bill could you just make me a website to find the closest US embassy with the shortest waiting time", as the Gov website requires you to manually lookup each embassy to check the waiting times.

After a quick look at the network calls made from the website I could see a simple approach to extract all the waiting times of all embassies. Combining this information with the embassies location data, I could recommend to my friend the best embassy.

### Architecture

As the project was simple I chose to publish it onto a website for anyone to use.

I didn't want to abuse the links the GOV website had exposed so I devised a JS funciton on the cloud to call the oldest scraped embassy on the DB and repeat this process every hour during UK hours. This means the frequency I'm sending requests is very low.

I hosted the website on Vercel and used Next 13 as it pre-renders all pages (which aren't dynamic) and improves SEO ranking due to sending raw HTML to the client side.

For styling the website I opted for Tailwind due to it's simplicity and ability to create great results fast, perfect for making a small app/website.

![Website Screenshot](assets/embass_map_snap.png)

Rather than using a paid map API service, like Google Maps, I implemented a simplified version of a map using the [D3](https://d3js.org/) library to render close embassies. The implementation works pretty well for giving the website more content, however, the end user would prefer more functionality. An improvement would be using [OSM](https://www.openstreetmap.org/).

### Overview

**Site**: [link](https://embass.io)

**Technologies:** *MongoDB, Next 13 (server side rendering), Tailwind, Cloud JS functions*
