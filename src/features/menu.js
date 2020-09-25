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

# This is my css code
*{
    margin:0;
    padding:0;
    font-family: sans-serif;
} 
.container{
    width: 100%;
    height: 100%;
    background: #42455a;
}
.menu ul{
    display: inline-flex;
    margin: 50px;
}
.menu ul li{
    list-style: none;
    margin: 0 20px;
    color: #b2b1b1;
    cursor: pointer;
}
.logo img{
     width: 30px;
     margin-top: -7px;
     margin-right: 48px;
}
.active{
    color: #19dafa !important;
}
.signup-btn{
    top: 40px;
    right: 80px;
    position: absolute;
    text-decoration: none;
    color: #fff
}
.banner{
    width: 80%;
    height: 70%;
    top: 25%;
    left: 130px;
    position: absolute;
    color: #fff;
}
.app-text{
    width: 50%;
    float: left;
}
.app-text h1{
    font-size: 43px;
    width: 640px;
    position: relative;
    margin-left: 40px;
}
.app-text p{
    width: 650px;
    font-size: 15px;
    margin: 30px 0 30px 40px;
    line-height: 25px;
    color: #919191;
}
.app-picture{
    width: 50%;
    float: right;
}
.app-picture img{
    width: 80%;
    margin-top: -20px;
    padding-left: 50px;
}
.play-btn{
    margin-left: 40px;
    display: inline-flex;
}
.play-btn-inner{
    height: 50px;
    width: 50px;
    border: 2px solid transparent;
    border-radius: 50% ;
    background-image: linear-gradient(#42455a,#42455a),radial-gradient(circle at top left,#fd00da,#19d7f8);
    background-origin: border-box;
    background-clip: content-box,border-box;  
    text-align: center;
}
.play-btn-inner .fa{
    padding: 18px 0;
    font-size: 13px;
    cursor: pointer;
}
small{
    margin: auto 20px;
    cursor: pointer;
    font-size: 12px;
    color: #19dafa;
    letter-spacing: 3px;
}
.quick-links{
    left: 0;
    bottom: 0;
    position: absolute;
    background: linear-gradient(to right, #db1bf6,#19d7f8);
}
.quick-links ul{
    display: inline-flex;
    margin: 30px auto;
    text-align: center;
}
.quick-links ul li{
    list-style: none;
    margin: 0 50px;
    cursor: pointer;
}
.quick-links ul li .fa{
    font-size: 25px;
    color: #fff;
}
.quick-links ul li p{
    margin-top: 15px;
    font-size: 10px;
    color: #fff;
}
.social-icons{
    right: 72px;
    bottom: 35px;
    position: absolute;
}
.social-icons ul li{
    list-style: none;
    margin-top: 15px;
    text-align: center;
}
.social-icons ul li a{
    border-radius: 50%;
    padding: 5px;
    display: block;
    color: #999;
    border: 1px solid #999
    
}