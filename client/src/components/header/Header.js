import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Header = () => {
	const auth = useSelector((state) => state.auth);
	//console.log(auth);
	const { user, isLogged } = auth;

	const userLink = () => {
		return (
			<li>
				<Link>
					<img src={user.avatar} alt='' /> {user.name}
				</Link>
			</li>
		);
	};

	return (
		<header>
			<div className='logo'>
				<h1>
					<Link to='/'>AUTH</Link>
				</h1>
			</div>
			<ul>
				<li>
					<Link to='/'>
						<i className='fas fa-shopping-cart'></i>Cart
					</Link>
				</li>
				{isLogged ? (
					userLink()
				) : (
					<li>
						<Link to='/login'>
							<i className='fas fa-user'></i> Sign in
						</Link>
					</li>
				)}
			</ul>
		</header>
	);
};

export default Header;
