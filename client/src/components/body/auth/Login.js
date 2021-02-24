import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
	showErrMsg,
	showSuccessMsg,
} from '../../utils/notification/notification';

const initialState = {
	email: '',
	password: '',
	err: '',
	success: '',
};

const Login = () => {
	const [user, setUser] = useState(initialState);
	const { email, password, err, success } = user;

	const handleChange = (e) => {
		const { name, value } = e.target;

		setUser({ ...user, [name]: value, err: '', success: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post('/user/login', { email, password });
			setUser({ ...user, err: '', success: res.data.msg });
			localStorage.setItem('firstLogin', true);
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: '' });
		}
	};

	return (
		<div className='login_page'>
			<h2>Login</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='email'>Email Address</label>
					<input
						type='text'
						placeholder='Email'
						id='email'
						name='email'
						value={email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						placeholder='Password'
						id='password'
						name='password'
						value={password}
						onChange={handleChange}
					/>
				</div>
				<div className='row'>
					<button type='submit'>Login</button>
					<Link to='/forgot_password'>Forgot Passowrd?</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;
