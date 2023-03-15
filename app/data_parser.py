def get_sorted_data(memos):
    sorted_memos = {"kodai": [], "chusei": [], "kinsei": [], "kindai": [], "gendai": []}
    eras = {
        "kodai": ["縄文時代", "弥生時代", "古墳時代", "飛鳥時代", "奈良時代", "平安時代"],
        "chusei": ["鎌倉時代", "室町時代", "戦国時代"],
        "kinsei": ["江戸時代", "幕末"],
        "kindai": ["明治時代", "昭和時代（戦前）", "第二次世界大戦"],
        "gendai": ["昭和時代（戦後）", "平成時代"]
    }
    for memo in memos:
        memo_era = ""
        for era in eras.keys():
            if memo["era"] in eras[era]: memo_era = era
        sorted_memos[memo_era].append(memo)
    return sorted_memos

def get_parsed_data(memos):
    for memo in memos:
        memo["era_color"] = get_color_for_era(memo["era"])
        memo["citations_text"] = memo["citations"].split(",")
    return memos

def get_single_stringified_data(memo, tick_keys):
    memo["era_color"] = get_color_for_era(memo["era"])
    memo["citations_text"] = memo["citations"].split(",")
    return stringify_memo_data(memo, tick_keys)

def get_stringified_data(memos, tick_keys):
    proper_quote = "\\\"" if tick_keys else "\""
    if len(memos) >= 1:
        all_memo_data = "{" + proper_quote + "memos" + proper_quote + ": ["
        for i in range(len(memos)):
            all_memo_data += get_single_stringified_data(memos[i], tick_keys)
            if i == len(memos) - 1: all_memo_data += "]}"
            else: all_memo_data += ", "
        return all_memo_data
    return "{" + proper_quote + "memos" + proper_quote + ": []}"

def stringify_memo_data(memo_data, tick_keys):
    memo_str = "{";
    proper_quote = "\\\"" if tick_keys else "\""
    proper_double_quote = "\\\\\\\"" if tick_keys else "\\\""
    for key in memo_data.keys():
        if key == "id": continue
        elif key == "citations": continue
        elif key == "content":
            memo_content_formatted = memo_data["content"].replace("\"", proper_double_quote).replace("\n", "")
            memo_str += proper_quote + "content" + proper_quote + ": " + proper_quote + memo_content_formatted + proper_quote + ", "
        elif key == "citations_text":
            memo_str += proper_quote + "citations" + proper_quote + ": " + str(memo_data["citations_text"]).replace("'", proper_quote) + ", "
        else:
            memo_str += proper_quote + key + proper_quote + ": " + proper_quote + str(memo_data[key]).replace("'", proper_quote) + proper_quote + ", "
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