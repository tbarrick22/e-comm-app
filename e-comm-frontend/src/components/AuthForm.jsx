function AuthForm({
	title,
	username,
	setUsername,
	password,
	setPassword,
	handleSubmit,
	error,
}) {
	return (
		<div className="p-4">
			<h2 className="text-xl mb-4">{title}</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="Username"
					className="border p-2 w-full"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-2 w-full"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					{title}
				</button>
				{error && <p className="text-red-500">{error}</p>}
			</form>
		</div>
	);
}

export default AuthForm;
