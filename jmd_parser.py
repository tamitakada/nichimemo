import re

def parse_table(markdown_text):
    markdown_text = re.sub(r"^\|(.*)\|$", r"<tr><td>\1</td></tr>", markdown_text, flags=re.MULTILINE)
    markdown_text = markdown_text.replace("|", "</td><td>")
    markdown_text = re.sub(r"\[colspan=(\d*)\](.*)\[\/colspan\]", r'<td colspan="\1">\2</td>', markdown_text)
    markdown_text = re.sub(r"\[rowspan=(\d*)\](.*)", r'<td rowspan="\1">\2</td>', markdown_text)
    markdown_text = re.sub(r"- (.*)", r"<li>\1</li>", markdown_text)
    return markdown_text

def parse_headings(markdown_text):
    markdown_text = re.sub(r"\[h6\](.*)\[\/h6\]", r"<h6>\1</h6>", markdown_text)
    markdown_text = re.sub(r"\[h5\](.*)\[\/h5\]", r"<h5>\1</h5>", markdown_text)
    markdown_text = re.sub(r"\[h4\](.*)\[\/h4\]", r"<h4>\1</h4>", markdown_text)
    markdown_text = re.sub(r"\[h3\](.*)\[\/h3\]", r"<h3>\1</h3>", markdown_text)
    markdown_text = re.sub(r"\[h2\](.*)\[\/h2\]", r"<h2>\1</h2>", markdown_text)
    markdown_text = re.sub(r"\[h1\](.*)\[\/h1\]", r"<h1>\1</h1>", markdown_text)
    return markdown_text

def parse_boxes(markdown_text):
    markdown_text = markdown_text.replace("[box=ASIDE]", "<div style='background-color: var(--ice);'>")
    markdown_text = markdown_text.replace("[box=POLITICAL]", "<div style='background-color: var(--lime);'>")
    markdown_text = markdown_text.replace("[box=ECONOMIC]", "<div style='background-color: var(--sun);'>")
    markdown_text = markdown_text.replace("[box=MILITARY]", "<div style='background-color: var(--red);'>")
    markdown_text = markdown_text.replace("[/box]", "</div>")
    return markdown_text

def parse_markdown(markdown_text):
    # Headings
    markdown_text = parse_headings(markdown_text)
    
    # Boxes
    markdown_text = parse_boxes(markdown_text)
    
    # Table
    markdown_text = markdown_text.replace("[table]", "<table>")
    markdown_text = markdown_text.replace("[/table]", "<table>")
    markdown_text = parse_table(markdown_text)
    
    # Bullet points
    markdown_text = markdown_text.replace("[]", "<li>")
    markdown_text = markdown_text.replace("[/]", "</li>")
    
    # Links
    markdown_text = re.sub(r"\[(.*)\]\((.*)\)", r'<a href="\2">\1</a>', markdown_text)
    
    # Highlighting text
    markdown_text = re.sub(r"==(.*)==", r"<mark>\1</mark>", markdown_text)
    
    # Bolding text
    markdown_text = re.sub(r"\*\*(.*)\*\*", r"<b>\1</b>", markdown_text)
    
    # Changing text color
    markdown_text = re.sub(r"\[color=(.*)\](.*)\[\/color\]", r'<span style="color:\1">\2</span>', markdown_text)
    
    # Shadowing text
    markdown_text = re.sub(r"\[shadow=(.*)\](.*)\[\/shadow\]", r'<span style="shadow: 0 0 1.5px var(--\1), 0 0 7px var(--\1)">\2</span>', markdown_text)
    
    # Ruby
    markdown_text = re.sub(r"\[ruby=(.*)\](.*)\[\/ruby\]", r'<ruby>\2<rt>\1</rt></ruby>', markdown_text)
    
    # Tooltip
    markdown_text = re.sub(r"\[tooltip=(.*)\](.*)\[\/tooltip\]", r'<span>\1</span>', markdown_text)
    
    return markdown_text

def hot_reload():
    with open("data/nara/0.txt") as f:
        markdown_text = f.read()

        jmd = parse_markdown(markdown_text)
        print(jmd)
        
        with open("jmd_test.html", "w") as f:
            f.write(f"<!DOCTYPE html><html><head><link rel='stylesheet' href='app/static/css/base.css'></head><body>{jmd}</body></html>")

hot_reload()
