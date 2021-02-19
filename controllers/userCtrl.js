const User = require('../models/userModel');
const sendEmail = require('./sendMail');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { CLIENT_URL } = process.env;

const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body;

			if (!name || !email || !password)
				return res.status(400).json({ msg: 'Please fill in all fields' });
			if (!validateEmail(email)) {
				res.status(400).json({ msg: 'Invalid email' });
			}

			const user = await User.findOne({ email });
			if (user)
				return res.status(400).json({ msg: 'This email already exists' });

			if (password.length < 6)
				return res
					.status(400)
					.json({ msg: 'Password must be atleast 6 characters' });

			const passwordHash = await bcrypt.hash(password, 12);

			const newUser = {
				name,
				email,
				password: passwordHash,
			};

			const activation_token = createActivationToken(newUser);

			const url = `${CLIENT_URL}/user/activate/${activation_token}`;
			sendEmail(email, url, 'Verify your email address');
			res.json({
				msg: 'Registered Successfully, Please activate email to start',
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	activateEmail: async (req, res) => {
		try {
			const { activation_token } = req.body;
			const user = jwt.verify(
				activation_token,
				process.env.ACTIVATION_TOKEN_SECRET
			);
			const { name, email, password } = user;

			const check = await User.findOne({ email });
			if (check)
				return res.status(400).json({ msg: 'This email already exists' });

			const newUser = new User({ name, email, password });
			await newUser.save();
			res.status(201).json({ msg: 'Account has been activated!' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ msg: error.message });
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			if (!validateEmail(email))
				return res.status(400).json({ msg: 'Invalid email' });

			const user = await User.findOne({ email });
			if (!user)
				return res.status(400).json({ msg: 'This email does not exists' });

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({ msg: 'Passowrd is incorrect.' });

			const refreshToken = createRefreshToken({ id: user._id });
			res.cookie('refreshtoken', refreshToken, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});
			res.json({ msg: 'Logging in...' });
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	},
	getAccessToken: async (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken;
			if (!rf_token) return res.status(400).json({ msg: 'Please login' });

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) return res.status(400).json({ msg: 'Please login' });

				const access_token = createAccessToken({ id: user.id });
				res.json({ access_token });
			});
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email });
			if (!user)
				return res.status(400).json({ msg: "This email doesn't exists" });

			const access_token = createAccessToken({ id: user._id });
			const url = `${CLIENT_URL}/user/reset/${access_token}`;
			sendEmail(email, url, 'Reset Password');
			res.json({ msg: 'Check your email' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	resetPassword: async (req, res) => {
		try {
			const { password } = req.body;
			const passwordHash = await bcrypt.hash(password, 12);
			console.log(passwordHash);

			await User.findOneAndUpdate(
				{ _id: req.user.id },
				{
					password: passwordHash,
				}
			);
			return res.json({ msg: 'Password changed successfully!' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getUserInfor: async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select('-password');
			res.json(user);
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getAllUserInfor: async (req, res) => {
		try {
			const users = await User.find().select('-password');

			res.json(users);
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
			return res.json({ msg: 'Logout' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateUser: async (req, res) => {
		try {
			const { name, avatar } = req.body;
			await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
			return res.json({ msg: 'Updated successfully!' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateUserRole: async (req, res) => {
		try {
			const { role } = req.body;

			await User.findOneAndUpdate({ _id: req.params.id }, { role });
			res.json({ msg: 'Update Success' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	deleteUser: async (req, res) => {
		try {
			await User.findByIdAndDelete(req.params.id);
			res.json({ msg: 'User Removed' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
};

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: '5m',
	});
};

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
};

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
};

module.exports = userCtrl;
