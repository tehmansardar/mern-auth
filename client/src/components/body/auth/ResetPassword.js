import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
	showErrMsg,
	showSuccessMsg,
} from '../../utils/notification/notification';
import { isLength, isMatch } from '../../utils/validation/validation';

const initialState = {
	password: '',
	cf_password: '',
	err: '',
	success: '',
};

const ResetPassword = () => {
	const [data, setData] = useState(initialState);
	const { password, cf_password, err, success } = data;
	const { token } = useParams();

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: '', success: '' });
	};

	const handleResetPass = async () => {
		if (isLength(password))
			return setData({
				...data,
				err: 'Password must be atleast 6 characters',
				success: '',
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: 'Password did not match', success: '' });

		try {
			const res = await axios.post(
				'/user/reset',
				{ password },
				{
					headers: { Authorization: token },
				}
			);
			return setData({ ...data, err: '', success: res.data.msg });
		} catch (error) {
			err.response.data.msg &&
				setData({ ...data, err: err.response.data.msg, success: '' });
		}
	};

	return (
		<div className='fg_pass'>
			<h2>Forgot Password?</h2>
			<div className='row'>
				{err && showErrMsg(err)}
				{success && showSuccessMsg(success)}

				<label htmlFor='email'>Enter new Password</label>
				<input
					type='password'
					name='password'
					id='password'
					value={password}
					onChange={handleChangeInput}
				/>

				<label htmlFor='email'>Confirm new Password</label>
				<input
					type='password'
					name='cf_password'
					id='cf_password'
					value={cf_password}
					onChange={handleChangeInput}
				/>
				<button onClick={handleResetPass}>Verify your email</button>
			</div>
		</div>
	);
};

export default ResetPassword;
