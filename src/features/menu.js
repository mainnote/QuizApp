import React from 'react';
import clsx from 'clsx';
import { LOG, } from '../config';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './menu.css';

export default function ( props ) {
    const location = useLocation();
    const pathname = location.pathname;
    LOG( 'DEBUG: (menu.js) Rendering menu with pathname:', pathname );
    const { t } = useTranslation();

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-color">
            <Link className="navbar-brand" to="/"><img src="/favicon-32x32.png" alt={ t( 'biblestudy' ) } />{ t( 'biblestudy' ) }</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className={ clsx( 'nav-item', pathname === '/' && 'active' ) }>
                        <Link className="nav-link" to="/">{ t( 'home' ) }</Link>
                    </li>
                    <li className={ clsx( 'nav-item', pathname.startsWith( '/quiz' ) && 'active' ) }>
                        <Link className="nav-link" to="/quiz">{ t( 'quiz' ) }</Link>
                    </li>
                    <li className={ clsx( 'nav-item', pathname.startsWith( '/results' ) && 'active' ) }>
                        <Link className="nav-link" to="/results">{ t( 'result' ) }</Link>
                    </li>
                    <li className={ clsx( 'nav-item', pathname.startsWith( '/content' ) && 'active' ) }>
                        <Link className="nav-link" to="/content">Test Content</Link>
                    </li>
                </ul>
                <form className="form-inline mt-2 mt-md-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
};
