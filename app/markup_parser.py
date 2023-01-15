import json

def get_markup_data(memos):
    for memo in memos:
        if "images" in memo:
            memo["image_data"] = get_image_data(memo["images"])

        memo["era_color"] = get_color_for_era(memo["era"], memo["time_period"])
        memo["citations_text"] = memo["citations"].split(",")
        memo["markup_text"] = markup_to_marked_up(memo["markup"])
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

def get_hierarchy_node(lines, current, col):
    if current >= len(lines): return []
    else:
        nodes = lines[current].split("|")
        node_hierarchy = []
        for i in range(len(nodes)):
            node = nodes[i]

            option_end_index = node.index("}")
            node_data = json.loads(node[0:(option_end_index + 1)])
            if "p" in node_data and node_data["p"] != col: return []

            if len(node) > 0: 
                node_hierarchy.append([
                    {"data": node_data, "components": markup_line(node[(option_end_index + 1):])}, 
                    get_hierarchy_node(lines, current + 1, i)
                ])
        return node_hierarchy
            

def markup_to_marked_up(markup: str):
    marked_up = []
    paragraphs = markup.split("\n\n")
    for i in range(len(paragraphs)):
        lines = paragraphs[i].split("\n")
        if len(lines) > 0:
            p_data = markup_p_data(json.loads(lines[0]))
            marked_up.append({"style": p_data["style"], "type": p_data["type"], "lines": []})

            if p_data["type"] == "table":
                for j in range(1, len(lines)):
                    marked_up[i]["lines"].append([])
                    cells = lines[j].split("|")
                    for cell in cells:
                        if len(cell) > 0:
                            option_end_index = cell.index("}")
                            marked_up[i]["lines"][j - 1].append({
                                "data": json.loads(cell[0:(option_end_index + 1)]),
                                "components": markup_line(cell[(option_end_index + 1):])
                            })
            elif p_data["type"] == "hierarchy": 
                marked_up[i]["lines"] = get_hierarchy_node(lines[1:], 0, 0)
            else:
                for j in range(1, len(lines)):
                    line = lines[j]
                    if len(line) > 0:
                        option_end_index = line.index("}")
                        marked_up[i]["lines"].append({
                            "data": markup_t_data(json.loads(line[0:(option_end_index + 1)])),
                            "components": markup_line(line[(option_end_index + 1):])
                        })
    return marked_up

def markup_p_data(p_data: dict) -> dict:
    if "box_style" in p_data:
        box_style = p_data["box_style"]
        if box_style == "i":
            return {
                "type": "div",
                "style": "background-color: var(--ice); color: var(--navy); border-radius: 10px; padding: 10px;"
            }
        elif box_style == "s":
            return {
                "type": "div",
                "style": "border: 4px solid var(--sea); color: white; border-radius: 10px; padding: 10px;"
            }
        elif box_style == "table": return {"type": "table", "style": ""}
        elif box_style == "hierarchy": return {"type": "hierarchy", "style": ""}
    style = ""
    for key in p_data.keys(): style += f"{key}: {p_data[key]};"
    return {"type": "div", "style": style}

def markup_t_data(t_data: dict) -> dict:
    marked_up = {"style": ""}

    if "style" in t_data:
        text_style = t_data["style"]
        if text_style == "h":
            marked_up["style"] = "text-align: center; padding: 10px 0; color: var(--navy);"
            marked_up["tag_type"] = "t"
        elif text_style == "i":
            marked_up["style"] = "background-color: var(--red); color: var(--navy);"
        elif text_style == "gtt":
            marked_up["style"] = "text-shadow: 0 0 1.5px var(--lime), 0 0 7px var(--lime); color: var(--lime);"
        elif text_style == "gp":
            marked_up["style"] = "text-shadow: 0 0 1.5px var(--red), 0 0 7px var(--red); color: var(--red);"
        elif text_style == "kw":
            marked_up["style"] = "color: var(--sun);"
        elif text_style == "sh":
            marked_up["style"] = "padding: 5px 0; color: var(--navy);"
            marked_up["tag_type"] = "t"
        elif text_style == "s":
            marked_up["style"] = "background-color: var(--ice); color: var(--navy);"
        elif text_style == "ke":
            marked_up["style"] = "background-color: var(--sun); color: var(--navy);"
    
    for key in t_data.keys(): 
        if key == "tt": marked_up["tooltip"] = t_data[key]
        elif key == "f": marked_up["furigana"] = t_data[key]
        elif key == "a": marked_up["link"] = t_data[key]
        elif key == "t": marked_up["tag_type"] = t_data[key]
        else: marked_up["style"] += f"{key}: {t_data[key]};"
    return marked_up

def markup_line(line: str) -> dict:
    components = []

    option_search = False
    option_text = ""

    component_text = ""

    c = 0
    while c < len(line):
        if line[c] == "<":
            if len(component_text) > 0:
                components.append({"text": component_text, "data": {}})
                component_text = ""
            option_search = True
        elif line[c] == ">":
            components.append({
                "text": component_text,
                "data": markup_t_data(json.loads(option_text)) 
            })
            option_text = ""
            component_text = ""
        elif option_search:
            option_text += line[c]
            if line[c] == "}": option_search = False
        else:
            component_text += line[c]
            if c == len(line) - 1:
                components.append({"text": component_text, "data": {}})
        c += 1
    return components