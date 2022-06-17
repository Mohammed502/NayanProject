import { useState, useEffect } from "react";
import "../styles/products.scss";
import {useNavigate} from 'react-router-dom';

const URL = "http://localhost:10000";

const Products = ({isLoggedIn}) => {
	const [products, setProducts] = useState([]);
	const [quantity, setQuantity] = useState('');
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const getProducts = async () => {
		const response = await fetch(`${URL}/product/getProducts`);
		const data = await response.json();
		if (data.success) {
			const _products = data.body.products.map((product) => ({
				...product,
				initOrder: false,
			}));
			setProducts([..._products]);
		}
	};

	const placeOrder = async (_id) => {
		if(!isLoggedIn) 
			return navigate('/login');
		const response = await fetch(`${URL}/product/placeOrder`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({quantity, deliveryAddress, productId: _id}),
			credentials: 'include'
		});
		const data = await response.json();
		if(data.success) {
			alert('Order placed');
			cancelOrder(_id);
		}
		else 
			setError(data.body.message);
	};

	const initializeOrder = (_id) => {
		const _products = products.map((product) => {
			if (product._id === _id) return { ...product, initOrder: true };
			return { ...product, initOrder: false };
		});
		setProducts((prev) => [..._products]);
	};

	const cancelOrder = (_id) => {
		const _products = products.map((product) => ({
			...product,
			initOrder: false,
		}));
		setProducts((prev) => [..._products]);
	};

	useEffect(() => {
		if (error) setTimeout(() => setError(""), 3000);
	}, [error]);

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<div className="products">
			<h1>Products</h1>
			<ul className="products-list">
				{products.map((product) => {
					return (
						<li key={product._id} className="product">
							<img
								src={product.image}
								alt="Product"
								className="product-image"
							/>
							<h3 className="product-name">{product.name}</h3>
							<p className="product-name">
								{product.price}₹ per unit
							</p>
							<p className="product-name">
								{product.description}
							</p>
							<input
								type="button"
								onClick={() => initializeOrder(product._id)}
								value="Order"
								className='order-button'
							/>
							<div
								className={`order-modal ${
									product.initOrder
										? "show-order-modal"
										: "hide-order-modal"
								}`}
							>
								<input
									type="button"
									onClick={() => cancelOrder(product._id)}
									value="X"
									className='close-button'
								/>
								<p>Order {product.name}</p>
								<input
									type="number"
									placeholder="Quantity"
									value={quantity}
									onChange={({ target: { value } }) =>
										setQuantity(value)
									}
								/>
								<textarea
									placeholder="Delivery Address"
									value={deliveryAddress}
									onChange={({ target: { value } }) =>
										setDeliveryAddress(value)
									}
								/>
								{error && <p className='order-error'>{error}</p>}
								<input
									type="button"
									onClick={() => placeOrder(product._id)}
									value="Order"
									className='order-button'
								/>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Products;