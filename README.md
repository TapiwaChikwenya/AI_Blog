
Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3500`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🐳 Running with Docker

To run the application using Docker, follow these steps:

1. **Build the Docker Image**:
   ```bash
   docker-compose up --build
   ```

2. **Access the Application**:
   Open your browser and go to `http://localhost:3500`.

3. **Stop the Docker Containers**:
   Press `Ctrl+C` in the terminal where Docker is running, or run:
   ```bash
   docker-compose down
   ```

## ☁️ Deploying to Azure

To deploy this application to Azure, follow these steps:

1. **Create an Azure Web App**:
   - Go to the Azure Portal.
   - Create a new Web App resource.
   - Choose Docker as the publishing option.

2. **Configure the Azure Web App**:
   - Set the Docker image source to your Docker registry (e.g., Docker Hub, Azure Container Registry).
   - Use the same Dockerfile and docker-compose.yml configuration as in your local setup.

3. **Deploy the Docker Image**:
   - Push your Docker image to the chosen Docker registry.
   - Configure the Azure Web App to pull the image from the registry.

4. **Set Environment Variables** (if needed):
   - In the Azure Portal, navigate to your Web App.
   - Go to Configuration > Application settings.
   - Add any necessary environment variables.

5. **Start the Web App**:
   - Once the image is deployed, start the Web App.
   - Access your application using the URL provided by Azure.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

6. **Tagging the image**

   ```bash
   docker tag ai_blog-astro-app:latest flafourwrx/ai_blog-astro-app:latest
   ```
7. **Pushing the image to the registry**

   ```bash
   docker push flafourwrx/ai_blog-astro-app:latest
   ```
8. **Building the image locally**

   ```bash
   docker-compose build
   ```
