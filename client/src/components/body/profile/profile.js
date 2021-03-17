import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { isLength, isMatch } from '../../utils/validation/validation';
import {
	showSuccessMsg,
	showErrMsg,
} from '../../utils/notification/notification';

const initialState = {
	name: '',
	password: '',
	cf_password: '',
	err: '',
	success: '',
};

const Profile = () => {
	const auth = useSelector((state) => state.auth);
	const token = useSelector((state) => state.token);
	const { user, isAdmin } = auth;
	const [data, setData] = useState(initialState);
	const { name, password, cf_password, err, success } = data;

	const [avatar, setAvatar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [callback, setCallback] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: '', success: '' });
	};

	const changeAvatar = async (e) => {
		e.preventDefault();
		try {
			const file = e.target.files[0];

			if (!file)
				return setData({
					...data,
					err: 'No files were uploaded.',
					success: '',
				});

			if (file.size > 1024 * 1024)
				return setData({ ...data, err: 'Size too large.', success: '' });

			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				return setData({
					...data,
					err: 'File format is incorrect.',
					success: '',
				});

			let formData = new FormData();
			formData.append('file', file);

			setLoading(true);
			const res = await axios.post('/api/uploadAvatar', formData, {
				headers: {
					'content-type': 'multipart/form-data',
					Authorization: token,
				},
			});

			setLoading(false);
			setAvatar(res.data.url);
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: '' });
		}
	};

	const updateInfor = () => {
		try {
			axios.patch(
				'/user/update',
				{
					name: name ? name : user.name,
					avatar: avatar ? avatar : user.avatar,
				},
				{
					headers: { Authorization: token },
				}
			);
			setData({ ...data, err: '', success: 'Updated success' });
		} catch (error) {
			setData({ ...data, err: error.response.data.msg, success: '' });
		}
	};

	const updatePassword = () => {
		if (isLength(password))
			return setData({
				...data,
				err: 'Password must be atleast 6 characters',
				success: '',
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: 'Password did not match', success: '' });

		try {
			axios.patch(
				'/user/reset',
				{ password },
				{
					headers: { Authorization: token },
				}
			);
			setData({ ...data, err: '', success: 'Updated success' });
		} catch (error) {
			setData({ ...data, err: error.response.data.msg, success: '' });
		}
	};

	const handleUpdate = () => {
		if (name || avatar) updateInfor();
		if (password) updatePassword();
	};

	return (
		<>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}
			{loading && <h3>Loading......</h3>}

			<div className='profile_page'>
				<div className='col-left'>
					<h2>{isAdmin ? 'Admin Profile' : 'User Profile'}</h2>
					<div className='avatar'>
						<img src={avatar ? avatar : user.avatar} alt='profile picture' />
						<span>
							<i className='fas fa-camera'></i>
							<p>Change</p>
							<input
								type='file'
								name='file'
								id='file_up'
								onChange={changeAvatar}
							/>
						</span>
					</div>

					<div className='form-group'>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							id='name'
							placeholder='your name'
							defaultValue={user.name}
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							placeholder='your email'
							defaultValue={user.email}
							disabled
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='password'>New Password</label>
						<input
							type='password'
							name='password'
							id='password'
							placeholder='Password'
							defaultValue={password}
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='cf_password'>Confirm New Password</label>
						<input
							type='password'
							name='cf_password'
							id='cf_password'
							placeholder='Confirm Password'
							defaultValue={cf_password}
							onChange={handleChange}
						/>
					</div>

					<div>
						<em style={{ color: 'crimson' }}>
							* If you update your password here, you will not be able to login
							quickly using google and facebook.
						</em>
					</div>

					<button disabled={loading} onClick={handleUpdate}>
						Update
					</button>
				</div>

				<div className='col-right'>
					<h2>{isAdmin ? 'Users' : 'My Orders'}</h2>
					<div style={{ overflowX: 'auto' }}>
						<table className='customers'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Admin</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>ID</td>
									<td>Name</td>
									<td>Email</td>
									<td>Admin</td>
									<td>Action</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
