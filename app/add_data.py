import database

with open(input("File Path: ")) as f:
    lines = f.read().split("\n\n\n")

    metadata = lines[0].split("\n")

    database.add_memo(
        metadata[0],
        lines[1],
        metadata[1],
        metadata[2],
        metadata[4],
        metadata[3]
    )