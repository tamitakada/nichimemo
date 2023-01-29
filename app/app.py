from flask import Flask, render_template, request, abort

import database
import markup_parser as mp

app = Flask(__name__)

@app.route("/")
def get_home():
    memos = mp.get_markup_data([
        database.find_memo_by_id(58267),
        database.find_memo_by_id(51366),
        database.find_memo_by_id(67982),
        database.find_memo_by_id(80544),
        database.find_memo_by_id(38451)
    ])
    return render_template("index.html", feature=True, memos=memos)

@app.route("/<era>")
def get_era(era):
    valid_eras = ["古代", "中世", "近世", "近代", "現代"]
    if era not in valid_eras: abort(404)
    else:
        memos = mp.get_markup_data(database.find_all_memos_in_era(era))
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
    # app.debug = True
    app.run(port=8000)