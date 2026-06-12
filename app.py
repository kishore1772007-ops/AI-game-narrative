from flask import Flask, render_template, request
from story_generator import generate_story

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():

    story = ""

    if request.method == "POST":
        action = request.form["action"]
        print("User entered:", action)
        story = generate_story(action)

    return render_template(
        "index.html",
        story=story
    )

if __name__ == "__main__":
    app.run(debug=True)