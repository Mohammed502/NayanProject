import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/form.scss';

const Signup = ({signup, error}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if(await signup({username, password, confirmPassword})) 
			navigate('/');
	};

	return (
		<div className="form-container">
			<form className="form">
				<h2>SIGN UP</h2>
				<div className="input-field">
					<label htmlFor='username'>Username</label>
					<input
						name='username'
						type="text"
						value={username}
						onChange={({ target: { value } }) => setUsername(value)}
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
				<div className="input-field">
					<label htmlFor='username'>Confirm Password</label>
					<input
						name='confirmPassword'
						type="password"
						value={confirmPassword}
						onChange={({ target: { value } }) => setConfirmPassword(value)}
					/>
				</div>
				{error && <p>{error}</p>}
				<div className="submit-button">
					<input type="button" value="Sign Up" onClick={handleSubmit}/>
				</div>
				<div className='form-link'>
					<a href='/login'>Already have an account? Login</a>
				</div>
			</form>
		</div>
	);
};

export default Signup;