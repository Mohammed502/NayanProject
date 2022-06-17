import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Navigation } from "./components/navigation";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Products from "./components/Products";
import JsonData from "./data/data.json";
import { Contact } from "./components/contact";

const URL = "http://localhost:10000";

const App = () => {
	const [landingPageData, setLandingPageData] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState({});
	const [error, setError] = useState("");

	const login = async ({ username, password }) => {
		if (!username || !password) {
			setError("Fill all the fields");
			return false;
		}
		const response = await fetch(`${URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
			credentials: "include",
		});
		const data = await response.json();
		if (data.success) {
			setUser(data.body.user);
			setIsLoggedIn(true);
			return true;
		} else setError(data.body.message);
		return false;
	};

	const signup = async ({ username, password, confirmPassword }) => {
		if (!username || !password || !confirmPassword) {
			setError("Fill all the fields");
			return false;
		}
		const response = await fetch(`${URL}/auth/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password, confirmPassword }),
			credentials: "include",
		});
		const data = await response.json();
		if (data.success) {
			setUser(data.body.user);
			setIsLoggedIn(true);
			return true;
		} else setError(data.body.message);
		return false;
	};

	const logout = async () => {
		console.log(1);
		const response = await fetch(`${URL}/auth/logout`, {
			method: "DELETE",
			credentials: "include",
		});
		const data = await response.json();
		if (data.success) {
			setIsLoggedIn(false);
			setUser({});
		}
	};

	const refresh = async () => {
		const response = await fetch(`${URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});
		const data = await response.json();
		if (data.success) {
			setIsLoggedIn(true);
			setUser(data.body.user);
		}
	};

	useEffect(() => {
		if (error) setTimeout(() => setError(""), 3000);
	}, [error]);

	useEffect(() => {
		refresh();
		setLandingPageData(JsonData);
	}, []);

	return (
		<div>
			<Router>
				<Navigation {...{ user, isLoggedIn, logout }} />
				<Routes>
					<Route
						exact
						path="/"
						element={<Home landingPageData={landingPageData} />}
					/>
					<Route
						path="/login"
						element={
							isLoggedIn ? (
								<Navigate to="/" />
							) : (
								<Login {...{ login, error }} />
							)
						}
					/>
					<Route
						path="/signup"
						element={
							isLoggedIn ? (
								<Navigate to="/" />
							) : (
								<Signup {...{ signup, error }} />
							)
						}
					/>
					<Route path="/products" element={<Products isLoggedIn={isLoggedIn}/>} />
				</Routes>
				<Contact data={landingPageData.Contact} />
			</Router>
		</div>
	);
};

export default App;