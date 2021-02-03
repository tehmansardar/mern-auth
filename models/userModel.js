const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please enter email'],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please enter password'],
		},
		role: {
			type: Number,
			default: 0, //0=user 1=admin
		},
		avatar: {
			type: String,
			default:
				'https://res.cloudinary.com/djz8da7ym/image/upload/v1612167167/auth/profile_li5zfl.png',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Users', userSchema);
