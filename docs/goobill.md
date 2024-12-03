# Goobill

*Nov 20, 2021*

![Website Screenshot](assets/img/goobill_snap.PNG)

### Origin Story

My friends who don't understand what I do, joked about me working for google, becoming CEO and renaming it to Goobill. So one day I made a spoof of Google and called it Goobill. I then later converted it to my portfolio page allowing people to "search" my projects. 

### Architecture

The main home page is TailwindCSS and React, however, all other pages origanted as a Markdown file and were pre-rendered to an HTML file. One markdown to another. Utilising [NextJS Mdx](https://nextjs.org/docs/pages/building-your-application/configuring/mdx) and [Github Markdown CSS](https://github.com/sindresorhus/github-markdown-css) to pre-render the files. What's interesting is if you inspect element the generated HTML, it's perfect for SEO optimisation.

### Overview

**Technologies:** *Next 13 (server side rendering), Tailwind*