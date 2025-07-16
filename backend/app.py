from flask import Flask, request, jsonify
from flask_cors import CORS
from meesho_scraper import scrape_meesho_prices

app = Flask(__name__)
CORS(app)

@app.route("/api/scrape-prices", methods=["POST"])
def get_prices():
    data = request.get_json()
    product_name = data.get("productName", "")

    if not product_name:
        return jsonify({"error": "Missing product name"}), 400

    prices = scrape_meesho_prices(product_name)
    return jsonify(prices)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
