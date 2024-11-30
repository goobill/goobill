# Embass.io

*Sep 14, 2021*

![Website Screenshot](/embass_snap.PNG)

### Origin Story

During lockdown my friend tried to go to America to work on boats, however, he struggled to find any US embassy appointments as the London branch was closed. He jokingly asked me "Bill could you just make me a website to find the closest US embassy with the shortest waiting time", as the Gov website requires you to manually lookup each embassy to check the waiting times.

After a quick look at the network calls made from the website I could see a simple approach to extract all the waiting times of all embassies. Combining this information with the embassies location data, I could recommend to my friend the best embassy.

### Architecture

As the project was simple I chose to publish it onto a website for anyone to use.

I didn't want to abuse the links the GOV website had exposed so I devised a JS funciton on the cloud to call the oldest scraped embassy on the DB and repeat this process every hour during UK hours. This means the frequency I'm sending requests is very low.

I hosted the website on Vercel and used Next 13 as it pre-renders all pages (which aren't dynamic) and improves SEO ranking due to sending raw HTML to the client side.

For styling the website I opted for Tailwind due to it's simplicity and ability to create great results fast, perfect for making a small app/website.

![Website Screenshot](/embass_map_snap.PNG)

Rather than using a paid map API service, like Google Maps, I implemented a simplified version of a map using the [D3](https://d3js.org/) library to render close embassies. The implementation works pretty well for giving the website more content, however, the end user would prefer more functionality. An improvement would be using [OSM](https://www.openstreetmap.org/).

### Overview

**Site**: [link](https://embass.io)

**Technologies:** *MongoDB, Next 13 (server side rendering), Tailwind, Cloud JS functions*

# Game

*Feb 16, 2020*

![Game Snapshot](/game_snap.png)

### Origin Story

I enjoyed the arty side of coding and wanted to explore making my own game using bold colour themes. So I developed my own mobile game, as it could easily be published globally and appeal to any group. I only deployed to Android as the initial developer fee was a one time payment of £40 and for Apple I would have had to pay a £100 fee every year, Apple also requires Apple hardware to build the app (I have a Thinkpad)

### Overview

Unity was chosen over Unreal Engine 4 as the requirements were simple, also I was developing in Java at the time and wanted to try C# as the language built on the flaws of Java.

The highlight during development was optimising the score display during gameplay. The game was developed for molbiles, so memory was limited, and creating lots of immutable strings to display the current score was innefficient. Every time the user scored (which could be multiple times a second) the Garbage Collector would of had to remove all those strings representing the past scores.

``` C#
    public TMP_Text tmpScoreText1;
    public TMP_Text tmpScoreText10;
    public TMP_Text tmpScoreText100;
    public TMP_Text tmpScoreText1000;

    private static readonly string[] numbers = new string[] {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};
    private static TMP_Text scoreText1;
    private static TMP_Text scoreText10;
    private static TMP_Text scoreText100;
    private static TMP_Text scoreText1000;
    private static int score;

    void Start()
    {
        scoreText1 = tmpScoreText1;
        scoreText10 = tmpScoreText10;
        scoreText100 = tmpScoreText100;
        scoreText1000 = tmpScoreText1000;
    }

    public static void Reset() {
        score = 0;
        if (scoreText1 != null) scoreText1.SetText(numbers[0]);
        if (scoreText10 != null) scoreText10.SetText(numbers[0]);
        if (scoreText100 != null) scoreText100.SetText(numbers[0]);
        if (scoreText1000 != null) scoreText1000.SetText(numbers[0]);
    }

    public static int GetScore() {
        return score;
    }
    
    public static void IncreaseScore() {
        score++;
        SetScore(score);
    }

    public static void DecreaseScore() {
        if (score > 1)
        {
            score = score - 2;    
            SetScore(score);
        }
        else if (score > 0)
        {
            score = score - 1;    
            SetScore(score);
        }
    }

    private static void SetScore(int i) {
        int ones = (i % 10);
        int tens = (i % 100) / 10;
        int hundreds = (i % 1000) / 100;
        int thousands = (i % 10000) / 1000;
        scoreText1.SetText(numbers[ones]);
        scoreText10.SetText(numbers[tens]);
        scoreText100.SetText(numbers[hundreds]);
        scoreText1000.SetText(numbers[thousands]);
    }


```

Instead, all of the numbers from 0 to 9 were instantiated as strings and stored in a constant array. The actual score was recorded using a hidden number. The score being displayed can be calculated by breaking the number into ones, tens, thousands and tens of thousands and referencing the immutable strings in the constant array. This is much more memory performant than converting the number to a new string every time the score updates.

**Site**: [link](https://play.google.com/store/apps/details?id=com.underscorerocks.rocks)

**Technologies:** *Unity, C#, Adsense, Adobe*

# Goobill

*Nov 20, 2021*

![Website Screenshot](/goobill_snap.PNG)

### Origin Story

My friends who don't understand what I do, joked about me working for google, becoming CEO and renaming it to Goobill. So one day I made a spoof of Google and called it Goobill. I then later converted it to my portfolio page allowing people to "search" my projects. 

### Architecture

The main home page is TailwindCSS and React, however, all other pages origanted as a Markdown file and were pre-rendered to an HTML file. One markdown to another. Utilising [NextJS Mdx](https://nextjs.org/docs/pages/building-your-application/configuring/mdx) and [Github Markdown CSS](https://github.com/sindresorhus/github-markdown-css) to pre-render the files. What's interesting is if you inspect element the generated HTML, it's perfect for SEO optimisation.

### Overview

**Technologies:** *Next 13 (server side rendering), Tailwind*