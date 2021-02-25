import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './auth/Login';
import Register from './auth/Register';
const Body = () => {
	return (
		<section>
			<Switch>
				<Route path='/login' component={Login} exact />
				<Route path='/register' component={Register} exact />
			</Switch>
		</section>
	);
};

export default Body;
