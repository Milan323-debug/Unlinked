import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
	const [usernameOrEmail, setUsernameOrEmail] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Logged in successfully");
			// Wait for the query to be invalidated before navigating
			setTimeout(() => {
				navigate("/");
			}, 100);
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Something went wrong");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// Determine if input is email or username based on @ symbol
		const isEmail = usernameOrEmail.includes('@');
		loginMutation({
			[isEmail ? 'email' : 'username']: usernameOrEmail,
			password,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
			<div className="space-y-1">
				<input
					type="text"
					placeholder="Username or Email"
					value={usernameOrEmail}
					onChange={(e) => setUsernameOrEmail(e.target.value)}
					className="input input-bordered w-full"
					required
				/>
				<p className="text-xs text-gray-500">
					Enter your username or email address
				</p>
			</div>
			
			<div className="space-y-1">
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="input input-bordered w-full"
					required
					minLength={6}
				/>
				<p className="text-xs text-gray-500">
					Password must be at least 6 characters
				</p>
			</div>

			<button 
				type="submit" 
				className="btn btn-primary w-full"
				disabled={isLoading || !usernameOrEmail.trim() || !password.trim()}
			>
				{isLoading ? <Loader className="size-5 animate-spin" /> : "Login"}
			</button>
		</form>
	);
};

export default LoginForm;