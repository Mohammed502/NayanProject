import { useState } from "react";
import emailjs from "emailjs-com";
// import {payment} from
const initialState = {
	name: "",
	email: "",
	message: "",
};
export const Contact = (props) => {
	const [{ name, email, message }, setState] = useState(initialState);
	console.log(props.payment);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};
	const clearState = () => setState({ ...initialState });

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(name, email, message);
		emailjs
			.sendForm(
				"service_3e5bitp",
				"template_fwngeti",
				e.target,
				"user_yQTAIUS1QpagsAUfcLd3C"
			)
			.then(
				(result) => {
					console.log(result.text);
					clearState();
				},
				(error) => {
					console.log(error.text);
				}
			);
	};
	return (
		<div>
			<div id="contact">
				<div className="container">
					<div className="col-md-4">
						<div className="row">
							<div className="section-title">
								<h2>Get In Touch</h2>
								<p>
									Please fill out the form below to send us an
									email and we will get back to you as soon as
									possible. Contact Us and get the latest
									price.
								</p>
							</div>
							<form
								name="sentMessage"
								validate
								onSubmit={handleSubmit}
							>
								<div className="row">
									<div className="col-md-6">
										<div className="form-group">
											<input
												type="text"
												id="name"
												name="name"
												className="form-control"
												placeholder="Name"
												required
												onChange={handleChange}
											/>
											<p className="help-block text-danger"></p>
										</div>
									</div>
									<div className="col-md-6">
										<div className="form-group">
											<input
												type="email"
												id="email"
												name="email"
												className="form-control"
												placeholder="Email"
												required
												onChange={handleChange}
											/>
											<p className="help-block text-danger"></p>
										</div>
									</div>
								</div>
								<div className="form-group">
									<textarea
										name="message"
										id="message"
										className="form-control"
										rows="4"
										placeholder="Message"
										required
										onChange={handleChange}
									></textarea>
									<p className="help-block text-danger"></p>
								</div>
								<div id="success"></div>
								<button
									type="submit"
									className="btn btn-custom btn-lg"
								>
									Send Message
								</button>
							</form>
						</div>
					</div>
					<div className="col-md-3 col-md-offset-1 contact-info">
						<div className="contact-item">
							<h3>Contact Info</h3>
							<p>
								<span>
									<i className="fa fa-map-marker"></i> Address
								</span>
								{props.data ? props.data.address : "loading"}
							</p>
						</div>
						<div className="contact-item">
							<p>
								<span>
									<i className="fa fa-phone"></i> Phone
								</span>{" "}
								{props.data ? props.data.phone : "loading"}
							</p>
						</div>
						<div className="contact-item">
							<p>
								<span>
									<i className="fa fa-envelope-o"></i> Email
								</span>{" "}
								{props.data ? props.data.email : "loading"}
							</p>
						</div>
					</div>
					<img src=""></img>
					<div className="col-md-3 mt-5">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.066696689152!2d72.83838671407639!3d19.016782458774873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cec3f462dfbd%3A0x8f317d1b39e5e5ce!2sSenapati%20Bapat%20Marg%2C%20Dadar%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1645814594528!5m2!1sen!2sin"
							width="300"
							height="300"
							allowfullscreen=""
							loading="lazy"
							title="map"
						></iframe>
					</div>
				</div>
			</div>
		</div>
	);
};
