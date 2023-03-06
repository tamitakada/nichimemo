from flask import Flask, render_template, request, abort

import database
import data_parser as dp

app = Flask(__name__)

@app.route("/")
def get_home():
    initial_search = database.find_all_memos_in_era("古代")
    memos = dp.get_parsed_data(initial_search)
    initial_memo_data = dp.get_stringified_data(initial_search, True);
    return render_template("index.html", memos=memos, initial_memo_data=initial_memo_data)

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
        memos = dp.get_stringified_data(database.find_all_memos_in_era(valid_eras[era]), False)
        return memos

@app.route("/search")
def get_search():
    query = request.args['q']
    memos = dp.get_parsed_data(database.find_memos_matching_query(query.upper()))

    return render_template(
        "index.html",
        memos=memos,
        query=query
    )

if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run(port=8000)
