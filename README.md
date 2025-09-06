# ProcessViz AI - Intelligent Process Diagram Generator

This web application, built with React and powered by the Gemini API, automatically generates step-by-step visual diagrams and professional audio commentary from descriptions of complex industrial processes.

## Features

-   **AI-Powered Process Decomposition**: Input a text description or an image, and the AI will break it down into logical steps.
-   **Customizable Visualization**: Choose from CAD, Schematic, or Photorealistic 3D rendering styles.
-   **Interactive Generation**: Review and approve each generated step, with the option to regenerate if needed.
-   **Downloadable Assets**: Save the generated images for your presentations and documentation.
-   **User-Provided API Key**: Securely use your own Gemini API key to power the application.

---

## Deployment to GitHub Pages

You can deploy this website for free using GitHub Pages. Follow these steps:

### 1. Create a GitHub Repository

If you haven't already, create a new repository on your GitHub account.

### 2. Push Your Code

Push all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) to your new GitHub repository. Your `main` branch should contain all the application files.

```bash
# Example commands
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 3. Configure GitHub Pages

1.  In your repository on GitHub, go to the **Settings** tab.
2.  In the left sidebar, click on **Pages**.
3.  Under the "Build and deployment" section, for the **Source**, select **Deploy from a branch**.
4.  Under "Branch", select your `main` branch and the `/ (root)` folder. Click **Save**.

![GitHub Pages Settings](https://docs.github.com/assets/cb-126230/images/help/pages/branch-source-for-pages.png)

### 4. Access Your Site

GitHub will start a deployment process. After a minute or two, your site will be live! You can find the URL in the same "Pages" settings screen. It will look something like this:

`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

Your ProcessViz AI application is now deployed and accessible to everyone.
