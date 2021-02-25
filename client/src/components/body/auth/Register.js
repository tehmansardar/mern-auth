import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
	showErrMsg,
	showSuccessMsg,
} from '../../utils/notification/notification';

import {
	isEmpty,
	isEmail,
	isLength,
	isMatch,
} from '../../utils/validation/validation';

const initialState = {
	name: '',
	email: '',
	password: '',
	cf_password: '',
	err: '',
	success: '',
};

const Register = () => {
	const [user, setUser] = useState(initialState);
	const { name, email, password, cf_password, err, success } = user;

	const handleChange = (e) => {
		const { name, value } = e.target;

		setUser({ ...user, [name]: value, err: '', success: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isEmpty(name) || isEmpty(password))
			return setUser({
				...user,
				err: 'Please fill in all fields',
				success: '',
			});

		if (!isEmail(email))
			return setUser({
				...user,
				err: 'Invalid email',
				success: '',
			});

		if (isLength(password))
			return setUser({
				...user,
				err: 'Password must be atleast 6 characters',
				success: '',
			});

		if (!isMatch(password, cf_password))
			return setUser({
				...user,
				err: "Password didn't match",
				success: '',
			});

		try {
			const res = await axios.post('/user/register', { name, email, password });
			setUser({ ...user, err: '', success: res.data.msg });
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: '' });
		}
	};

	return (
		<div className='login_page'>
			<h2>Register</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						placeholder='Name'
						id='name'
						name='name'
						value={name}
						onChange={handleChange}
					/>
				</div>
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
				<div>
					<label htmlFor='cf_password'>Confirm Password</label>
					<input
						type='password'
						placeholder='Confirm password'
						id='cf_password'
						name='cf_password'
						value={cf_password}
						onChange={handleChange}
					/>
				</div>
				<div className='row'>
					<button type='submit'>Register</button>
				</div>
			</form>
			<p>
				Already have account? <Link to='/login'>Login</Link>
			</p>
		</div>
	);
};

export default Register;
