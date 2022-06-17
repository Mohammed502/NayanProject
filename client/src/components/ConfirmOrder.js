import {useEffect} from 'react';

import '../styles/confirmOrder.scss';

const URL = 'http://localhost:10000/product/confirmOrder';

const ConfirmOrder = () => {
	const confirmOrder = async () => {
		const response = await fetch(URL, {
			method: 'POST',
			credentials: 'include'
		});
		const data = await response.json();
		window.location.replace('/');
	};

	useEffect(() => {
		confirmOrder();
	}, []);

	return (
		<div className='confirm-order'>
			<h3>Confirming your order</h3>
			<div className='loading'></div>
		</div>	
	);
};

export default ConfirmOrder;