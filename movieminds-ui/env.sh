# movieminds-ui/env.sh
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  REACT_APP_API_BASE_URL: '$(echo $REACT_APP_API_BASE_URL)'," >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js