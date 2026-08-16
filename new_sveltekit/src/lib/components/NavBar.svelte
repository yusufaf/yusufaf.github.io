<nav class="nav-container">
	<ul>
		<li class="link-item">
			<a class="link" href="/">Home</a>
		</li>
		<li class="link-item">
			<a class="link" href="/resume/">Resume</a>
		</li>
		<li class="link-item">
			<a class="link" href="/projects/">Projects</a>
		</li>
		<li class="link-item">
			<a class="link" href="/demos/">Demos</a>
		</li>
		<a href="https://github.com/yusufaf" target="_blank" rel="noreferrer">
			<img
				class="github-logo"
				src="/images/github-logo.png"
				alt="Personal GitHub"
				title="Personal GitHub"
			/>
		</a>
		<a href="https://www.linkedin.com/in/yusuf-afzal/" target="_blank" rel="noreferrer">
			<img class="linkedin-logo" src="/images/linkedin.svg" alt="LinkedIn" title="LinkedIn" />
		</a>
	</ul>
</nav>

<style>
	.nav-container ul {
		background: #1f1b24;
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		height: 2.5rem;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.link-item {
		display: inline-flex;
		margin-right: 10px;
	}

	.link {
		color: white;
		text-align: center;
		text-decoration: none;
	}

	.link:hover {
		color: slateblue;
	}

	.github-logo {
		background: black;
		height: 24px;
		border: 2px solid slateblue;
		border-radius: 20px;
	}

	.github-logo:hover {
		background-color: slateblue;
	}

	.linkedin-logo {
		background: white;
		height: 24px;
		border: 2px solid slateblue;
		border-radius: 20px;
	}
</style>
