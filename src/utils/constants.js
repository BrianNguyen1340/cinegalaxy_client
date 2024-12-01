let apiRoot = ''

if (import.meta.env.BUILD_MODE === 'development') {
  apiRoot = 'http"//localhost:7777'
}

if (import.meta.env.BUILD_MODE === 'production') {
  apiRoot = 'https://cinegalaxy-server.onrender.com'
}

export const API_ROOT = apiRoot
