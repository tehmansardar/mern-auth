import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import {
	showErrMsg,
	showSuccessMsg,
} from '../../utils/notification/notification';

const ActivationEmail = () => {
	const { activation_token } = useParams();

	const [err, setErr] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (activation_token) {
			const activateEmail = async () => {
				try {
					const res = await axios.post('/user/activation', {
						activation_token,
					});
					setSuccess(res.data.msg);
				} catch (error) {
					error.response.data.msg && setErr(error.response.data.msg);
				}
			};
			activateEmail();
		}
	}, []);

	return (
		<div className='active_page'>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
		</div>
	);
};

export default ActivationEmail;
