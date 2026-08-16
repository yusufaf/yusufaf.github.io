<div class="about-container">
	<div class="about-section">
		<div class="section-title">About me</div>
		<div class="section-content">
			Hi there! My name is Yusuf Afzal. 🐨
			<br />
			I'm a graduating senior at the University of Oregon, majoring in Computer Science.
			<br />
			I'm currently working as a Web Development Intern at Pacific Northwest National Laboratory.
		</div>
	</div>
	<div class="about-section">
		<div class="section-title">Interests</div>
		<div class="section-content">
			<ul>
				<li>Building scalable and maintainable software</li>
				<li>Cloud and serverless technologies</li>
				<li>Developing software that makes the lives of businesses and consumers easier</li>
			</ul>
		</div>
	</div>
	<div class="about-section">
		<div class="section-title">Technical Skills</div>
		<div class="section-content">
			<ul>
				<li><strong>Programming Languages: </strong> Python, JavaScript, TypeScript, HTML, CSS</li>
				<li><strong>Frameworks:</strong> React, Svelte, Vue, Node.js, Django</li>
				<li><strong>Database:</strong> MySQL, MongoDB</li>
				<li><strong>Tools:</strong> AWS, Git, Docker, Jira, Confluence</li>
			</ul>
		</div>
	</div>
	<div class="about-section">
		<div class="section-title">Highlighted Projects</div>
		<div class="section-content indented">
			<div class="section-title">
				<a class="section-link" href="https://github.com/yusufaf/quizaroni">Quizaroni</a>
			</div>
			Create and share study flash cards with your friends.
		</div>
		<div class="section-content indented">
			<div class="section-title">
				<a class="section-link" href="https://github.com/yusufaf/nba-central">NBA Team Builder</a>
			</div>
			Build your own NBA team and aim for the best score. Share with friends and see who can build the
			best team.
		</div>
	</div>
</div>

<style>
	.about-container {
		background: #1f1b24;
		margin: 20px auto 0;
		width: min(45vw, 90vw);
		max-width: 45rem;
		height: 37.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
		padding: 10px 15px;
		overflow-y: auto;
	}

	.about-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.section-title {
		display: flex;
		color: white;
		font-weight: bold;
	}

	.section-content {
		color: white;
		text-align: left;
		white-space: pre-line;
	}

	.section-content.indented {
		padding-left: 1rem;
	}

	.section-link {
		color: white;
		transition: color 0.2s ease;
		text-decoration: none;
	}

	.section-link:hover {
		color: slateblue;
	}
</style>
