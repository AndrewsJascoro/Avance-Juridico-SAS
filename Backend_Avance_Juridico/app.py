from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import sqlite3
import xmltodict
import os
import logging
import xmlschema

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQL_FILE = os.path.join(BASE_DIR, "database/et_ComentariosAj.sql")
XML_FILE = os.path.join(BASE_DIR, "static/xml/et.xml")
SCHEMA_FILE = os.path.join(BASE_DIR, "static/xml/LOXML.xsd")
IMAGES_DIR = os.path.join(BASE_DIR, "static/images_gif")

# Validate XML against Schema
try:
    schema = xmlschema.XMLSchema(SCHEMA_FILE)
    is_valid = schema.is_valid(XML_FILE)
    logging.info(f"Is the XML valid? {is_valid}")
except xmlschema.exceptions.XMLSchemaException as e:
    logging.error(f"Error validating XML schema: {e}")


def query_sql(query, params=()):
    """Query the SQL database."""
    if not os.path.exists(SQL_FILE):
        return {"error": "SQL file not found."}
    try:
        conn = sqlite3.connect(SQL_FILE)
        cursor = conn.cursor()
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        return results
    except sqlite3.Error as e:
        logging.error(f"SQL error: {e}")
        return {"error": str(e)}


def parse_xml():
    """Parse the XML file."""
    if not os.path.exists(XML_FILE):
        return {"error": "XML file not found."}
    try:
        with open(XML_FILE, "r", encoding="utf-8") as file:
            data_dict = xmltodict.parse(file.read())
        return data_dict
    except Exception as e:
        logging.error(f"XML parsing error: {e}")
        return {"error": str(e)}


@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files."""
    static_dir = os.path.join(BASE_DIR, 'static')
    if not os.path.exists(os.path.join(static_dir, filename)):
        abort(404)
    return send_from_directory(static_dir, filename)


@app.route('/images/<path:filename>')
def serve_images(filename):
    """Serve image files."""
    if not os.path.exists(os.path.join(IMAGES_DIR, filename)):
        abort(404)
    return send_from_directory(IMAGES_DIR, filename)


@app.route('/data', methods=['GET'])
def get_data():
    """Serve the parsed XML data as JSON."""
    data = parse_xml()
    return jsonify(data)


@app.route('/search', methods=['GET'])
def search():
    """Search SQL and XML content."""
    query = request.args.get("query", "")
    sql_query = "SELECT * FROM comments WHERE text LIKE ?"
    sql_results = query_sql(sql_query, (f"%{query}%",))

    xml_data = parse_xml()
    xml_results = [
        element for element in xml_data.get("root", {}).get("elements", [])
        if query.lower() in str(element).lower()
    ]

    return jsonify({"sql_results": sql_results, "xml_results": xml_results})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
