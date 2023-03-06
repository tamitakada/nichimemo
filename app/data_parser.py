def get_parsed_data(memos):
    for memo in memos:
        memo["era_color"] = get_color_for_era(memo["era"])
        memo["citations_text"] = memo["citations"].split(",")
    return memos

def get_stringified_data(memos):
    if len(memos) > 1:
        all_memo_data = "{\"memos\": ["
        for i in range(len(memos)):
            memo = memos[i]
            memo["era_color"] = get_color_for_era(memo["era"])
            memo["citations_text"] = memo["citations"].split(",")
            all_memo_data += stringify_memo_data(memo)
            if i == len(memos) - 1: all_memo_data += "]}"
            else: all_memo_data += ", "
        return all_memo_data
    return "{\"memos\": []}"

def stringify_memo_data(memo_data):
    memo_str = "{";
    for key in memo_data.keys():
        if key == "id": continue
        elif key == "citations": continue
        elif key == "content":
            memo_content_formatted = memo_data["content"].replace("\"", "\\\"").replace("\n", "")
            memo_str += "\"content\": \"" + memo_content_formatted + "\", "
        elif key == "citations_text":
            memo_str += "\"citations\": " + str(memo_data["citations_text"]).replace("'", "\"") + ", "
        else:
            memo_str += "\"" + key + "\": \"" + str(memo_data[key]).replace("'", "\"") + "\", "
    memo_str = memo_str[:-2]
    memo_str += "}"
    return memo_str

def get_color_for_era(specific_era: str):
    eras = {
        "古代": (["縄文時代", "弥生時代", "古墳時代", "飛鳥時代", "奈良時代", "平安時代"], "var(--red)"),
        "中世": (["鎌倉時代", "室町時代", "戦国時代"], "var(--sun)"),
        "近世": (["江戸時代", "幕末"], "var(--lime)"),
        "近代": (["明治時代", "昭和時代（戦前）", "第二次世界大戦"], "var(--sea)"),
        "現代": (["昭和時代（戦後）", "平成時代"], "var(--ice)")
    }

    for key in eras.keys():
        if specific_era in eras[key][0]: return eras[key][1]