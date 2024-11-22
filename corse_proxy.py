from flask import Flask, request, Response
import requests

app = Flask(__name__)

@app.route('/proxy', methods=['GET'])
def proxy():
    target_url = request.args.get('url')  # Get the target URL from query parameters
    if not target_url:
        return "Missing 'url' parameter", 400

    try:
        # Forward the request to the target URL
        response = requests.get(target_url)
        # Create a new response with the original content and headers
        proxied_response = Response(response.content, status=response.status_code)
        proxied_response.headers.update(response.headers)
        # Allow all origins to bypass CORS restrictions
        proxied_response.headers['Access-Control-Allow-Origin'] = '*'
        return proxied_response
    except requests.RequestException as e:
        return f"Error fetching URL: {e}", 500

if __name__ == '__main__':
    app.run(port=8080)
