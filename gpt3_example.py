from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Get the API key from the environment variable
api_key = os.getenv("OPENAI_API_KEY")

# Initialize the Flask app and OpenAI API client
app = Flask(__name__)

# Use the API key retrieved from the environment variable
openai.api_key = api_key

@app.route('/get_answer', methods=['POST'])
def get_answer():
    user_question = request.json.get('userQuestion')
    if not user_question:
        return jsonify({'error': 'No question provided'}), 400

    try:
        ai_response = getAIResponse(user_question)
        return jsonify({'aiResponse': ai_response})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'An error occurred while fetching the AI response'}), 500

def getAIResponse(userQuestion, engine="davinci-003"):
    try:
        response = openai.Completion.create(
            engine=engine,
            prompt=userQuestion,
            max_tokens=50,
        )
        return response.choices[0].text
    except Exception as e:
        print('Error:', e)
        return 'An error occurred while fetching the AI response.'

if __name__ == '__main__':
    app.run(debug=True)
