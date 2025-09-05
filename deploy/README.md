Server configuration files for deploying SPA (Vite + Vue Router history mode).

- _redirects - Netlify
- nginx.conf - Nginx (adjust root and server_name)
- .htaccess - Apache
- web.config - IIS / Azure

After build you can copy these files into `dist/` and deploy the contents of `dist` to your server.
