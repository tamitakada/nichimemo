import sqlite3
import random
from datetime import date

def get_db():
    return sqlite3.connect("database.db")

"""
    Memo:
    id - unique int id
    title - memo title (unique)
    markup - memo body (in joto markup)
    era - kofun, asuka, taisho, etc.
    time_period - 1940-1945, 12000BC-8000BC, 1211, etc. [English format; full years required]
    citations - str, separated by commas
    last_edit_date - e.g. 2023-01-11
    images - JSON str - {'image_path': 'edo/kasei/art.png', 'caption': 'art!', 'p_number': 2, 'side': 'r'}
        * p-number specifies paragraph number to place image next to
        * side specifies whether to place image on right (r) or left (l) side
"""
def db_setup():
    db = get_db()
    c = db.cursor()

    command = """CREATE TABLE IF NOT EXISTS memos (
        id              INTEGER PRIMARY KEY,
        title           TEXT NOT NULL,
        markup          LONGTEXT NOT NULL,
        era             TEXT NOT NULL,
        time_period     TEXT NOT NULL,
        citations       TEXT NOT NULL,
        last_edit_date  DATE NOT NULL,
        images          TEXT
    );"""
    c.execute(command)

    db.commit()
    db.close()

def generate_unique_id():
    db = get_db()
    c = db.cursor()

    item_id = 0
    items = True
    while items:
        item_id = random.randint(10000, 99999)
        command = "SELECT * FROM memos WHERE id = ?"
        items = c.execute(command, (item_id,)).fetchone()

    db.close()
    return item_id

"""
    Returns 1 if memo is found and edited.
    Returns 0 if memo with specified id is not found.
"""
def edit_memo(id: int, title="", markup="", era="", time_period="", citations="", images=""):
    memo = find_memo_by_id(id)
    if memo:
        db = get_db()
        c = db.cursor()

        updated_info = {
            "title": title, 
            "markup": markup, 
            "era": era, 
            "time_period": time_period,
            "citations": citations,
            "images": images
        }

        for key in updated_info.keys():
            if key in memo.keys() and not updated_info[key]:
                updated_info[key] = memo[key]
        
        command = """UPDATE memos
            SET title = ?, 
                markup = ?, 
                era = ?, 
                time_period = ?, 
                citations = ?,
                last_edit_date = ?, 
                images = ? 
            WHERE id = ?;
        """
        
        c.execute(
            command, 
            (
                updated_info["title"], 
                updated_info["markup"], 
                updated_info["era"], 
                updated_info["time_period"],
                updated_info["citations"],
                date.today(),
                updated_info["images"], 
                id
            )
        )
        
        db.commit()
        db.close()
        
        return 1
    return 0

def add_memo(title: str, markup: str, era: str, time_period: str, citations: str, images=""):
    db = get_db()
    c = db.cursor()

    id = generate_unique_id()

    command = """INSERT INTO memos 
        (id, title, markup, era, time_period, citations, last_edit_date, images) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);"""
    c.execute(command, (id, title, markup, era, time_period, citations, date.today(), images))

    db.commit()
    db.close()

def delete_memo(id: int):
    db = get_db()
    c = db.cursor()

    command = "DELETE FROM memos WHERE id = ?"
    c.execute(command, (id,))

    db.close()

def find_memo_by_id(id: int):
    db = get_db()
    c = db.cursor()

    command = "SELECT * FROM memos WHERE id = ?"
    word = c.execute(command, (id,)).fetchone()

    db.close()

    return memo_tuple_to_dict(word)

# Converts memo tuple to dict
def memo_tuple_to_dict(memo):
    if memo:
        memo_dict = {
            "id": memo[0], 
            "title": memo[1],
            "markup": memo[2],
            "era": memo[3],
            "time_period": memo[4],
            "citations": memo[5],
            "last_edit_date": memo[6]
        }
        if memo[7] and len(memo[7]) > 0: memo_dict["images"] = memo[7]
        return memo_dict
    else: return None

def get_random_memos():
    db = get_db()
    c = db.cursor()

    command = "SELECT * FROM memos ORDER BY RANDOM() LIMIT 1"
    memos = c.execute(command).fetchall()

    db.close()

    all_memos = []
    for memo in memos: all_memos.append(memo_tuple_to_dict(memo))

    return all_memos

def find_memos_matching_query(query: str):
    db = get_db()
    c = db.cursor()

    command = f"""SELECT * FROM memos WHERE 
        title LIKE '%{query}%' OR 
        markup LIKE '%{query}%' OR
        era LIKE '%{query}%' ORDER BY time_period;"""
    memos = c.execute(command).fetchall()

    db.close()
    
    all_memos = []
    for memo in memos: all_memos.append(memo_tuple_to_dict(memo))

    return all_memos