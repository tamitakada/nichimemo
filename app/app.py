from flask import Flask, render_template, request, redirect, url_for
import database
import markup_parser as mp

app = Flask(__name__)

@app.route("/")
def get_home():
    memos = mp.get_markup_data(database.get_random_memos())

    return render_template("index.html", memos=memos)

@app.route("/search")
def get_search():
    query = request.args['q']
    memos = mp.get_markup_data(database.find_memos_matching_query(query))

    return render_template(
        "index.html",
        memos=memos,
        query=query
    )

if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run(port=8000)
