from flask import Flask, render_template, request, abort

import database
import data_parser as dp

app = Flask(__name__)

@app.route("/")
def get_home():
    memos = dp.get_parsed_data([
        database.find_memo_by_id(58267),
        database.find_memo_by_id(51366),
        database.find_memo_by_id(67982),
        database.find_memo_by_id(80544),
        database.find_memo_by_id(38451)
    ])
    return render_template("index.html", feature=True, memos=memos)

@app.route("/api/<era>", methods=["GET"])
def get_memo_data(era):
    valid_eras = {
        "kodai": "古代",
        "chusei": "中世",
        "kinsei": "近世", 
        "kindai": "近代", 
        "gendai": "現代"
    }
    if era not in valid_eras.keys(): abort(404)
    else:
        memos = dp.get_stringified_data(database.find_all_memos_in_era(valid_eras[era]))
        return memos

@app.route("/test")
def get_test():
    memos = dp.get_parsed_data([
        database.find_memo_by_id(58267)
    ])
    return render_template("test2.html", memos=memos)

@app.route("/<era>")
def get_era(era):
    valid_eras = {
        "kodai": "古代",
        "chusei": "中世", 
        "kinsei": "近世", 
        "kindai": "近代", 
        "gendai": "現代"
    }
    if era not in valid_eras.keys(): abort(404)
    else:
        memos = dp.get_parsed_data(database.find_all_memos_in_era(valid_eras[era]))
        return render_template("index.html", memos=memos)

@app.route("/search")
def get_search():
    query = request.args['q']
    memos = dp.get_parsed_data(database.find_memos_matching_query(query))

    return render_template(
        "index.html",
        memos=memos,
        query=query
    )

if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run(port=8000)
