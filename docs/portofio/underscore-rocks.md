# Game

*Feb 16, 2020*

![Game Snapshot](../assets/game_snap.png)

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
