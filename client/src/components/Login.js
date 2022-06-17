import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/form.scss';

const Login = ({login, error}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if(await login({email, password})) 
			navigate('/');
	};

	return (
		<div className="form-container">
			<form className="form">
				<h2>LOGIN</h2>
				<div className="input-field">
					<label htmlFor='email'>Email</label>
					<input
						type="email"
						value={email}
						onChange={({ target: { value } }) => setEmail(value)}
					/>
				</div>
				<div className="input-field">
					<label htmlFor='password'>Password</label>
					<input
						name='password'
						type="password"
						value={password}
						onChange={({ target: { value } }) => setPassword(value)}
					/>
				</div>
				{error && <p>{error}</p>}
				<div className="submit-button">
					<input type="button" value="Login" onClick={handleSubmit}/>
				</div>
				<div className='form-link'>
					<a href='/signup'>Don't have an account yet? Sign up</a>
				</div>
			</form>
		</div>
	);
};

export default Login;