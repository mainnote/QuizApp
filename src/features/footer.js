import React from 'react';
import { LOG, } from '../config';
import './footer.css';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const getYear = () => {
    return new Date().getFullYear();
}

export default function ( props ) {
    LOG('DEBUG: Rendering footer');
    const { t } = useTranslation();
    
    return (
        <footer className="footer-distributed container-fluid">
            <div className="row">
                <div className="footer-left col-sm">
                    <h3>{ t( 'biblestudy' ) }</h3>
                    <p className="footer-links">
                        <Link className="nav-link" to="/">{ t( 'home' ) }</Link>
                        <Link className="nav-link" to="/quiz">{ t( 'quiz' ) }</Link>
                        <Link className="nav-link" to="/results">{ t( 'result' ) }</Link>
                    </p>

                </div>
                <div className="footer-center col-sm">
                    <div>
                        <i className="fa fa-map-marker" />
                        <p><span>Clagay, Alberta</span> Canada</p>
                    </div>
                    <div>
                        <i className="fa fa-phone" />
                        <p>123-456-789</p>
                    </div>
                    <div>
                        <i className="fa fa-envelope" />
                        <p><a href="abc@example.com">abc@example.com</a></p>
                    </div>
                </div>
                <div className="footer-right col-sm">
                    <p className="footer-company-about">
                        <span>About us</span>
                    A small and brief description of the app should go here.
                </p>
                    <div className="footer-icons">
                        <a href="https://www.facebook.com/"><i className="fa fa-facebook" /></a>
                        <a href="https://twitter.com/"><i className="fa fa-twitter" /></a>
                        <a href="https://www.youtube.com/"><i className="fa fa-youtube" /></a>
                        <a href="https://www.instagram.com/"><i className="fa fa-instagram" /></a>
                    </div>
                </div>
                
            </div>
            <p className="footer-company-name row">
                Chinese Church © { getYear() }
                <Link className="nav-link" to="/privacy">{ t( 'privacy' ) }</Link>
                <Link className="nav-link" to="/terms">{ t( 'terms' ) }</Link>
            </p>
        </footer>
    );
};