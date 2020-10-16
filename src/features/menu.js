import React, { useContext } from 'react';
import clsx from 'clsx';
import $ from 'jquery';
import { LOG, } from '../config';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './menu.css';
import { Context as UserContext, ACTION_TYPE as ACTION_TYPE_USER, } from '../stores/userStore';
import { getWebsiteState } from '../stores/util';
import { Context as WebsiteContext } from '../stores/websiteStore';

export default function ( props ) {
    const [ stateWebsite ] = useContext( WebsiteContext );

    const handleNavCollapse = () => {
        $( '.navbar-collapse' ).collapse( 'hide' );
    };
    const location = useLocation();
    const pathname = location.pathname;
    LOG( 'DEBUG: (menu.js) Rendering menu with pathname:', pathname );
    const { t } = useTranslation();
    const [ stateUser, dispatchUser ] = useContext( UserContext );
    LOG( 'DEBUG: stateUser:', stateUser );
    const handleLogoutButtonClick = event => {
        event.preventDefault();
        handleNavCollapse();
        dispatchUser( {
            type: ACTION_TYPE_USER.RESET
        } );
    };
    const handleLoginButtonClick = event => {
        event.preventDefault();
        handleNavCollapse();
        dispatchUser( {
            type: ACTION_TYPE_USER.UPDATE,
            keys: [ 'show', 'isSignup' ],
            data: [ true, false ],
        } );
    };
    const handleSignupButtonClick = event => {
        event.preventDefault();
        handleNavCollapse();
        dispatchUser( {
            type: ACTION_TYPE_USER.UPDATE,
            keys: [ 'show', 'isSignup' ],
            data: [ true, true ],
        } );
    };

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-color">
            <Link className="navbar-brand" to="/"><img src="/favicon-32x32.png" alt={ getWebsiteState( stateWebsite, 'title' ) || t( 'biblestudy' ) } />{ getWebsiteState( stateWebsite, 'title' ) || t( 'biblestudy' ) }</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className={ clsx( 'nav-item', pathname === '/' && 'active' ) }>
                        <Link className="nav-link" to="/" onClick={ handleNavCollapse }>{ t( 'home' ) }</Link>
                    </li>
                    <li className={ clsx( 'nav-item', pathname.startsWith( '/results' ) && 'active' ) }>
                        <Link className="nav-link" to="/results" onClick={ handleNavCollapse }>{ t( 'result' ) }</Link>
                    </li>
                    <li className={ clsx( 'nav-item', pathname.startsWith( '/content' ) && 'active' ) }>
                        <Link className="nav-link" to={ { pathname: '/content/', search: '?title=记分方法介绍&_limit=1' } } onClick={ handleNavCollapse }>{ t( 'mark_count' ) }</Link>
                    </li>
                </ul>
                { stateUser.user ?
                    <button type="button" className="btn btn-outline-warning mr-2" onClick={ handleLogoutButtonClick }>
                        { t( 'logout' ) }
                    </button>
                    :
                    <React.Fragment>
                        <button type="button" className="btn btn-outline-warning mr-2" onClick={ handleLoginButtonClick }>
                            { t( 'login' ) }
                        </button>
                        <button type="button" className="btn btn-info mr-2" onClick={ handleSignupButtonClick }>
                            { t( 'signup' ) }
                        </button>
                    </React.Fragment>
                }
            </div>
        </nav>
    );
};
