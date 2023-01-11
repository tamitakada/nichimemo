# Adds ui info to memo dicts based on memo info
def get_markup_data(memos):
    for memo in memos:
        memo["era_color"] = get_color_for_era(memo["era"], memo["time_period"])
    return memos

def get_color_for_era(era: str, time_period: str):
    eras = {
        "原始・古代": "var(--red)",
        "中世": "var(--sun)",
        "近世": "var(--lime)",
        "近代": "var(--sea)",
        "現代": "var(--ice)"
    }

    years = time_period.split("-")
    latest_year = years[0]
    if len(years) > 1: latest_year = years[1]

    if latest_year.__contains__("BC"): return eras["原始・古代"]
    else:
        latest_year = int(latest_year)
        if latest_year < 1185: return eras["原始・古代"]
        elif latest_year < 1568: return eras["中世"]
        elif latest_year < 1868: return eras["近世"]
        elif latest_year < 1945 or (latest_year == 1945 and era == "第二次世界大戦"): 
            return eras["近代"]
        else: return eras["現代"]