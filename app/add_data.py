import database

print("Enter\n1 - add file\n2 - update file\n3 - remove file\n")
choice = input("What do you want to do? ")

if choice == "1":
    with open("../data/" + input("File Path: ../data/")) as f:
        metadata = f.read().split("\n")
        content = ""
        with open("../data/" + metadata[1]) as dataf:
            content = dataf.read()

        database.add_memo(
            metadata[0],
            content,
            metadata[2],
            metadata[3],
            metadata[4],
            metadata[6],
            metadata[5]
        )
elif choice == "2":
    memos = database.find_memos_matching_query(input("Memo query: "))
    if memos:
        if len(memos) > 1:
            for i in range(len(memos)): 
                print(f"{i}: {memos[i]['title']}")

            memo_num = input("Which memo? ")

            with open(input("File Path: ")) as f:
                lines = f.read().split("\n\n\n")

                metadata = lines[0].split("\n")

                database.edit_memo(
                    memos[int(memo_num)]["id"],
                    metadata[0],
                    lines[1],
                    metadata[1],
                    metadata[2],
                    metadata[3],
                    metadata[5],
                    metadata[4]
                )
        else:
            with open(input("File Path: ")) as f:
                lines = f.read().split("\n\n\n")

                metadata = lines[0].split("\n")

                database.edit_memo(
                    memos[0]["id"],
                    metadata[0],
                    lines[1],
                    metadata[1],
                    metadata[2],
                    metadata[3],
                    metadata[5],
                    metadata[4]
                )
elif choice == 3:
    memos = database.find_memos_matching_query(input("Memo query: "))
    if memos:
        if len(memos) > 1:
            for i in range(len(memos)): 
                print(f"{i}: {memos[i]['title']}")
            memo_num = input("Which memo? ")
            database.delete_memo(memos[int(memo_num)]["id"])
        else: database.delete_memo(memos[0]["id"])
    