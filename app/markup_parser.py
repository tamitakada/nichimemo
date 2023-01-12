import json

def get_markup_data(memos):
    for memo in memos:
        if "images" in memo:
            memo["image_data"] = get_image_data(memo["images"])

        memo["era_color"] = get_color_for_era(memo["era"], memo["time_period"])
        memo["citations_text"] = memo["citations"].split(",")
        memo["markup_text"] = get_markup_text(memo["markup"])
    return memos

def get_image_data(images: str):
    all_images = {} # paragraph number : [image data]
    for image in images.split(" "):
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

"""
    paragraph type options:
        b = box
        l = lined border
        d = default
"""
def get_markup_text(markup: str):
    paragraphs = markup.split("\n\n")
    marked_up_lines = [] # [(paragraph type, [[{"text", "tag_type", "style", "tooltip", "link"}]])]
    for p in range(len(paragraphs)):
        paragraph = paragraphs[p]

        lines = paragraph.split("\n")
        starting_line = 0
        if len(lines) > 0:
            if lines[0].__contains__("(B)"):
                starting_line = 1
                box_color = "var(--sea)"
                if len(lines[0]) > 6: box_color = lines[0][6:-1]
                marked_up_lines.append(("b", [[{"box_color": box_color}]]))
            else: marked_up_lines.append(("d", []))
        
        for line in lines[starting_line:]: 
            if line.__contains__("(H)"):
                marked_up_lines[p][1].append([{"text": line[3:], "tag_type": "p", "style": "padding: 0 5px; background-color: var(--sea); color: var(--navy);"}])
            else: marked_up_lines[p][1].append(parse_lines_with_options(line))

    return marked_up_lines

"""
    @param options: dict<str : str> - option dict
    @return: dict<str : str> - style, tooltip, link
"""
def convert_options_to_style(options: dict):
    style = {"style": ""}

    dt_option_style_dict = {
        "h": "padding: 0 5px; color: var(--navy); background-color: [c];",
        "g": "text-shadow: 0 0 1.5px [c], 0 0 7px [c]; color: [c];",
        "c": "color: [c];",
        "": ""
    }

    color = "transparent"
    if "c" in options: color = options["c"]

    if "dt" in options.keys() and options["dt"]:
        style["style"] += dt_option_style_dict[options["dt"]].replace("[c]", color)
    
    if "tt" in options.keys() and options["tt"]: style["tooltip"] = options["tt"]
    elif "a" in options.keys() and options["a"]: style["link"] = options["a"]
    
    if "f" in options.keys() and options["f"]: style["furigana"] = options["f"]

    return style

def parse_lines_with_options(line: str):
    components = [{"text": ""}]
    component_index = 0
    index_incremented = True

    option_value_search = False
    option_key_search = False
    option_key = ""
    option_value = ""

    options = {}
    option_search = False

    for i in range(len(line)):
        c = line[i]
        if c == "<":
            if not index_incremented:
                components.append({"text": ""})
                component_index += 1
            option_search = True
        elif c == ">":
            components.append({"text": ""})
            component_index += 1
            index_incremented = True
        elif option_search:
            if c == "{": option_key_search = True
            elif c == ":":
                option_key_search = False
                option_value_search = True
            elif c == ",":
                options[option_key] = option_value
                option_key = ""
                option_value = ""
                option_key_search = True
                option_value_search = False
            elif c == "}":
                options[option_key] = option_value
                option_search = False
                option_key = ""
                option_value = ""
                option_key_search = False
                option_value_search = False

                style = convert_options_to_style(options)
                components[component_index]["style"] = style["style"]
                if "tooltip" in style: components[component_index]["tooltip"] = style["tooltip"]
                if "link" in style: components[component_index]["link"] = style["link"]
                if "furigana" in style: components[component_index]["furigana"] = style["furigana"]
            elif option_key_search: option_key += c
            elif option_value_search: option_value += c
        else:
            index_incremented = False
            components[component_index]["text"] += c

    return components