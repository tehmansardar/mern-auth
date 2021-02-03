const { findOne } = require('../models/userModel');
const User = require('../models/userModel');

const bcrypt = require('bcrypt');

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

			// const passwordHash =

			console.log(name, email, password);
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
};

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

module.exports = userCtrl;
