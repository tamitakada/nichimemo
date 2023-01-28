import json

def get_markup_data(memos):
    for memo in memos:
        if "images" in memo:
            memo["image_data"] = get_image_data(memo["images"])

        memo["era_color"] = get_color_for_era(memo["era"], memo["time_period"])
        memo["citations_text"] = memo["citations"].split(",")
    return memos

def get_image_data(images: str):
    all_images = {} # paragraph number : [image data]
    for image in images.split(" "):
        print(image)
        image_data = json.loads(image)

        paragraph = 0
        if "p_number" in image_data: paragraph = image_data["p_number"]

        if paragraph in all_images: all_images[paragraph].append(image_data)
        else: all_images[paragraph] = [image_data]
    return all_images

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