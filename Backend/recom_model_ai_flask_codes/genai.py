from flask import Flask, render_template, request, jsonify
import json
import requests
import google.generativeai as genai

app = Flask(__name__)

system_prompt = """
##Role of the AI Assistant:
You are analysing tool which analyse the given data and provide the analysis of the schemes based on the core it provide the score is basicaly of the provided by the trained recommedation system  also there would be considered to having scheme and their detailso whichich demographic filter is used here in filter ::{} the schemes are recokmmended on the basis of the location and gender by filtering and the recommendation sistem ### so analyse the data acordingly, the scheme details present in scheme {} .provide a JSON response with the following format :
{ 
    "analysis": {
        "points": {
            "Point1": "Provide the first insightful analysis or observation here.",
            "Point2": "Provide the second key finding or insight here.",
            "Point3": "Provide the third relevant point here.",
            "Point4": "Provide the fourth important takeaway here."
        }
    }
}
"""

genai.configure(api_key="AIzaSyCn5UAt76WC7GZ--09qAzHd29mgz8G86TI")
model = genai.GenerativeModel("gemini-1.5-flash")

def query_gemini_api(user_query):
    try:
        response = model.generate_content(f"{system_prompt}\n\nUser: {user_query}")
        response_text = response.text.strip()
        return json.loads(response_text)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from model"}

@app.route('/explain', methods=['GET', 'POST'])
def explain():
    if request.method == 'POST':
        try:
            data = request.get_json(force=True)
            user_query = json.loads(json.dumps(data)) if data else None
            if user_query:
                response = query_gemini_api(user_query)
                return jsonify(response)
            return jsonify({"error": "No query provided"})
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON in request"}), 400
    return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    app.run(debug=True)