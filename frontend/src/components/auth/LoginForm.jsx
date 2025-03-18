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
		<form onSubmit={handleSubmit} className="space-y-4 w-full">
			<div>
				<input
					id="usernameOrEmail"
					type="text"
					placeholder="Username"
					value={usernameOrEmail}
					onChange={(e) => setUsernameOrEmail(e.target.value)}
					className="input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
					required
				/>
			</div>
			
			<div>
				<input
					id="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
					required
				/>
			</div>

			<button 
				type="submit" 
				className="btn btn-primary w-full h-12 rounded-md flex items-center justify-center text-white bg-primary hover:bg-primary-focus"
				disabled={isLoading || !usernameOrEmail.trim() || !password.trim()}
			>
				{isLoading ? <Loader className="size-5 animate-spin mr-2" /> : "Login"}
			</button>
		</form>
	);
};

export default LoginForm;