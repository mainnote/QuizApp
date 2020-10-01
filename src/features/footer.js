import React from 'react';
import { LOG, } from '../config';
import './footer.css';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const getYear = () => {
    return new Date().getFullYear();
}

export default function ( props ) {
    LOG( 'DEBUG: Rendering footer' );
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
                        <p><span>{ t( 'address' ) }</span> CANADA</p>
                    </div>
                    <div>
                        <i className="fa fa-phone" />
                        <p>{ t( 'phonenumber' ) }</p>
                    </div>
                    <div>
                        <i className="fa fa-envelope" />
                        <p><a href={ t( 'email' ) }>{ t( 'email' ) }</a></p>
                    </div>
                </div>
                <div className="footer-right col-sm">
                    <p className="footer-company-about">
                        <span>{ t( 'aboutus' ) }</span>
                        { t( 'aboutus_content' ) }
                    </p>
                    <div className="footer-icons">
                        <a href="https://www.facebook.com/"><i className="fa fa-facebook" /></a>
                        <a href="https://twitter.com/"><i className="fa fa-twitter" /></a>
                        <a href="https://www.youtube.com/"><i className="fa fa-youtube" /></a>
                        <a href="https://www.instagram.com/"><i className="fa fa-instagram" /></a>
                        <a href="https://www.instagram.com/"><i className="fa fa-weixin"></i></a>
                    </div>
                </div>

            </div>
            <p className="footer-company-name row">
                { t( 'biblestudy' ) } © { getYear() }
                <Link className="pl-2" to="/privacy">{ t( 'privacy' ) }</Link>
                <Link className="pl-2" to="/terms">{ t( 'terms' ) }</Link>
            </p>
        </footer>
    );
};