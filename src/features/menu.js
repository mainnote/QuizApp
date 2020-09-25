import React from 'react';
import { Link } from "react-router-dom";

export default function ( props ) {
    return (
        <html>
<head>
    <tile></tile>
    <link rel="stylesheet" href="style2.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

</head>
<body>
    <div class="container">
        <div class="menu">
            <ul>
                <li class="logo"></li><img src="diamond.png" width="50" height="50"  ></img>
                <li class="active">Navigation</li>
                <li class="active">Home page</li>
                <li class="active">Survey page: Questions and Answers</li>
                <li class="active">Result page</li>
                <li><a class="active">Login page</li>
                <li><a class="active">Footer</li>
                <li><a class="active">Privacy</li>
                <li><a class="active">Terms of use</li>
                
            </ul>
        </div>
        <div class="banner">
            <div class="app-text">
                <h1>Check out <br>our survey.</h1>
                <p>Here a brief description can  <br> go for the app and church.  </p>
                <div class="play-btn">
                    <div class="play-btn-inner"><i class="fa fa-play" aria-hidden="false"></i></div>
                    <small><b>Learn More</b></small>
                </div>
            </div>
            <div class="app-picture">
                <img src="picture.png">
            </div>
        </div>
        <div class="quick-links">
            <ul>
            <li><i class="fa fa-share-alt"></i><p>Share to</p></li>
            <li><i class="fa fa-audio-description"></i><p>Recent news</p></li>
            <li><i class="fa fa-cog"></i><p>Chinese church</p></li>
            <li><i class="fa fa-btc"></i><p>Survey</p></li>
            </ul>
        </div>
        <div class="social-icons">
            <ul>
                <li><a href="https://twitter.com/"><i class="fa fa-twitter"></i></a></li>
                <li><a href="https://www.youtube.com/"><i class="fa fa-youtube"></i></a></li>
                <li><a href="https://www.instagram.com/"><i class="fa fa-instagram"></i></a></li>
                <li><a href="https://www.facebook.com/"><i class="fa fa-facebook"></i></a></li>
            </ul>
        </div>
    </div>



</body>
</html>
    );
};