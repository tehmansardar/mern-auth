import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Login from './auth/Login';
import Register from './auth/Register';
import ActivationEmail from './auth/ActivationEmail';
import NotFound from '../utils/NotFound/NotFound';
import ForgotPassword from './auth/forgotPassword';
import ResetPassword from './auth/ResetPassword';
import Profile from './profile/profile';
import EditUser from './profile/EditUser';

const Body = () => {
	const auth = useSelector((state) => state.auth);
	const { isLogged, isAdmin } = auth;

	return (
		<section>
			<Switch>
				<Route path='/login' component={isLogged ? NotFound : Login} exact />
				<Route
					path='/register'
					component={isLogged ? NotFound : Register}
					exact
				/>
				<Route
					path='/forgot_password'
					component={isLogged ? NotFound : ForgotPassword}
					exact
				/>
				<Route
					path='/user/reset/:token'
					component={isLogged ? NotFound : ResetPassword}
					exact
				/>

				<Route
					path='/profile'
					component={isLogged ? Profile : NotFound}
					exact
				/>

				<Route
					path='/edit_user/:id'
					component={isAdmin ? EditUser : NotFound}
					exact
				/>

				<Route
					path='/user/activate/:activation_token'
					component={ActivationEmail}
					exact
				/>
			</Switch>
		</section>
	);
};

export default Body;
