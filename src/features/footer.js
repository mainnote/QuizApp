import React, { useContext, useEffect } from 'react';
import { requestGetWithDispatch } from '../stores/request';
import { LOG, API_ALL_WEBSITE } from '../config';
import './footer.css';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Context as WebsiteContext, ACTION_TYPE as ACTION_TYPE_WEBSITE } from '../stores/websiteStore';
import { getWebsiteState } from '../stores/util';

const getYear = () => {
    return new Date().getFullYear();
}

export default function ( props ) {
    const [ stateWebsite, dispatchWebsite ] = useContext( WebsiteContext );
    const { t } = useTranslation();

    // load post
    useEffect( () => {
        requestGetWithDispatch( dispatchWebsite, API_ALL_WEBSITE, ACTION_TYPE_WEBSITE.ADD, 'website' );
    }, [] );

    return (
        <footer className="footer-distributed container-fluid">
            <div className="row">
                <div className="footer-left col-sm">
                    <h3>{ getWebsiteState( stateWebsite, 'title' ) || t( 'biblestudy' ) }</h3>
                </div>
                <div className="footer-center col-sm">
                    <div>
                        <i className="fa fa-map-marker" />
                        <p><span>{ getWebsiteState( stateWebsite, 'address' ) || t( 'address' ) }</span> CANADA</p>
                    </div>
                    <div>
                        <i className="fa fa-phone" />
                        <p>{ getWebsiteState( stateWebsite, 'phone' ) || t( 'phonenumber' ) }</p>
                    </div>
                    <div>
                        <i className="fa fa-envelope" />
                        <p><a href={ getWebsiteState( stateWebsite, 'email' ) || t( 'contact_email' ) }>{ getWebsiteState( stateWebsite, 'email' ) || t( 'contact_email' ) }</a></p>
                    </div>
                </div>
                <div className="footer-right col-sm">
                    <p className="footer-company-about">
                        <span>{ t( 'aboutus' ) }</span>
                        { getWebsiteState( stateWebsite, 'aboutus' ) || t( 'aboutus_content' ) }
                    </p>
                    <div className="footer-icons">
                        <a href={ getWebsiteState( stateWebsite, 'facebook' ) || "https://www.facebook.com/" }><i className="fa fa-facebook" /></a>
                        <a href={ getWebsiteState( stateWebsite, 'twitter' ) || "https://twitter.com/" }><i className="fa fa-twitter" /></a>
                        <a href={ getWebsiteState( stateWebsite, 'youtube' ) || "https://www.youtube.com/" }><i className="fa fa-youtube" /></a>
                        <a href={ getWebsiteState( stateWebsite, 'instagram' ) || "https://www.instagram.com/" }><i className="fa fa-instagram" /></a>
                        <a href={ getWebsiteState( stateWebsite, 'wechat' ) || "https://www.instagram.com/" }><i className="fa fa-weixin"></i></a>
                    </div>
                </div>

            </div>
            <p className="footer-company-name row">
                { t( 'biblestudy' ) } © { getYear() }
                <Link className="pl-2" to={ { pathname: '/content/', search: '?title=隐私政策&_limit=1' } } >{ t( 'privacy' ) }</Link>
                <Link className="pl-2" to={ { pathname: '/content/', search: '?title=免责声明&_limit=1' } } >{ t( 'terms' ) }</Link>
            </p>
        </footer>
    );
};