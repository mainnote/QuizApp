import React, { useContext, useState } from 'react';
import { LOG, REGISTER_URL, LOGIN_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Nav, Form } from 'react-bootstrap';
import { Context as UserContext, ACTION_TYPE as ACTION_TYPE_USER, } from '../stores/userStore';
import validator from 'email-validator';
import { requestPost } from '../stores/request';

export default function ( props ) {
    const [ email, setEmail ] = useState( "" );
    const [ emailMsg, setEmailMsg ] = useState( "" );
    const [ username, setUsername ] = useState( '' );
    const [ usernameMsg, setUsernameMsg ] = useState( '' );
    const [ password, setPassword ] = useState( "" );
    const [ passwordlAgainMsg, setPasswordAgainMsg ] = useState( "" );
    const [ passwordAgain, setPasswordAgain ] = useState( "" );
    const [ messages, setMessages ] = useState( [] );
    LOG( 'DEBUG: Rendering user.js for login/signup' );
    const { t } = useTranslation();
    const [ stateUser, dispatchUser ] = useContext( UserContext );
    const onHide = event => {
        dispatchUser( {
            type: ACTION_TYPE_USER.UPDATE,
            keys: [ 'show' ],
            data: [ false ],
        } );
    };
    const handleSelectedTab = ( eventKey, event ) => {
        dispatchUser( {
            type: ACTION_TYPE_USER.UPDATE,
            keys: [ 'isSignup' ],
            data: [ eventKey === 'signup' ? true : false ],
        } );
    };

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit( event ) {
        event.preventDefault();
        if ( !validator.validate( email ) ) {
            return setEmailMsg( t( 'invalid_email' ) );
        }

        if ( stateUser.isSignup && username.length === 0 ) {
            return setUsernameMsg( t( 'invlid_username' ) )
        }

        if ( stateUser.isSignup && password !== passwordAgain ) {
            return setPasswordAgainMsg( t( 'password_not_same' ) )
        }

        if ( stateUser.isSignup ) {
            requestPost( REGISTER_URL, {
                email: email,
                username: username,
                password: password,
            } ).then( res => {
                LOG( res );
                afterPost( res );
                clearForm();
            } ).catch( error => {
                LOG( 'signup error: ', error.response.data );
                showErrorMessage( error.response.data.message[ 0 ].messages );
            } );
        } else {
            requestPost( LOGIN_URL, {
                identifier: email,
                password: password,
            } ).then( res => {
                LOG( res );
                afterPost( res );
                clearForm();
            } ).catch( error => {
                LOG( 'login error: ', error.response.data );
                showErrorMessage( error.response.data.message[ 0 ].messages );
            } );
        }

        function afterPost( res ) {
            dispatchUser( {
                type: ACTION_TYPE_USER.UPDATE,
                keys: [ 'show', 'jwt', 'user', 'isSignup' ],
                data: [ false, res.data.jwt, res.data.user, false ],
            } );
        }

        function showErrorMessage( messages ) {
            setMessages( messages );
        }

        function clearForm() {
            setEmail( '' );
            setEmailMsg( '' );
            setUsernameMsg( '' );
            setPassword( '' );
            setUsername( '' );
            setPasswordAgainMsg( '' );
            setMessages( [] );
        }
    }

    return (
        <Modal
            show={ stateUser.show }
            onHide={ onHide }
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{ t( 'login_reason' ) }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Nav
                    fill
                    variant="tabs"
                    onSelect={ handleSelectedTab }
                    defaultActiveKey={ stateUser.isSignup ? 'signup' : 'login' }>
                    <Nav.Item>
                        <Nav.Link eventKey="login">{ t( 'login' ) }</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="signup">{ t( 'signup' ) }</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Form
                    className="p-3 border-right border-bottom border-left"
                    onSubmit={ handleSubmit }>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control
                            type="email"
                            placeholder={ t( 'email' ) }
                            value={ email }
                            required
                            onChange={ e => setEmail( e.target.value ) }
                        />
                        <Form.Text className="text-danger">
                            { emailMsg }
                        </Form.Text>
                    </Form.Group>
                    { stateUser.isSignup &&
                        <Form.Group controlId="formUsername">
                            <Form.Control
                                type="text"
                                placeholder={ t( 'username' ) }
                                value={ username }
                                required
                                onChange={ e => setUsername( e.target.value ) }
                            />
                            <Form.Text className="text-danger">
                                { usernameMsg }
                            </Form.Text>
                        </Form.Group>
                    }
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder={ t( 'password' ) }
                            required
                            value={ password }
                            onChange={ e => setPassword( e.target.value ) }
                        />
                    </Form.Group>
                    { stateUser.isSignup &&
                        <Form.Group controlId="formBasicPasswordAgain">
                            <Form.Control
                                type="password"
                                placeholder={ t( 'password_again' ) }
                                required
                                value={ passwordAgain }
                                onChange={ e => setPasswordAgain( e.target.value ) }
                            />
                            <Form.Text className="text-danger">
                                { passwordlAgainMsg }
                            </Form.Text>
                        </Form.Group>
                    }
                    <div>
                        {
                            messages.map( message => (
                                <Form.Text className="text-danger" key={ message.id }>
                                    { t( message.id ) }
                                </Form.Text>
                            )
                            )
                        }
                    </div>
                    <div className="d-flex">
                        <div className="ml-auto"></div>
                        <Button
                            className="float-right"
                            variant="primary"
                            type="submit"
                            disabled={ !validateForm() } >
                            { stateUser.isSignup ? t( 'signup' ) : t( 'login' ) }
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};