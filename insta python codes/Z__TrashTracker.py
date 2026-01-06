import os, json, time
ROOT = r"D:\INSTA"
SKIP_NAMES = {"pin2","ATOZ","turbo","_HEIC_Converted","_HEIC_","AloHA"}            # names to skip (top-level or anywhere below ROOT)
DB = os.path.join(ROOT, "_name_db.json")
LOG = os.path.join(ROOT, "_scan_log.txt")

def load_db():
    if os.path.exists(DB):
        try:
            return json.load(open(DB, "r", encoding="utf-8"))
        except:
            return {"paths":{}, "deleted_names": []}
    return {"paths":{}, "deleted_names": []}

def save_db(data):
    json.dump(data, open(DB, "w", encoding="utf-8"), indent=1)

def is_skipped_path(path):
    # skip if any component of the path (relative to ROOT) matches a skip name
    rel = os.path.relpath(path, ROOT)
    parts = rel.split(os.sep)
    for p in parts:
        if p.lower() in {n.lower() for n in SKIP_NAMES}:
            return True
    return False

def log_line(line):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    entry = f"{ts}  {line}\n"
    try:
        with open(LOG, "a", encoding="utf-8") as L:
            L.write(entry)
    except:
        pass
    print(entry.strip())

def main():
    db = load_db()
    paths_db = db.get("paths", {})
    deleted_names = set(db.get("deleted_names", []))
    seen_now = set()

    for root, dirs, files in os.walk(ROOT):
        # skip entire branch if any component matches skip names
        if is_skipped_path(root):
            # prevent os.walk from descending into children of skipped dir
            dirs[:] = []
            continue

        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")    # key format: sub/folder/file.ext
            seen_now.add(rel)
            #log_line(f"{rel} >> present")

            # 1) If this exact tracked path was previously marked deleted -> delete immediately
            if paths_db.get(rel) == "deleted":
                try:
                    os.remove(full)
                    log_line(f"{rel} >> deleted (reappeared - same path)")
                except Exception as e:
                    log_line(f"{rel} >> failed delete (same path): {e}")
                continue

            '''# 2) If filename was deleted previously anywhere -> delete immediately
            if f in deleted_names:
                try:
                    os.remove(full)
                    log_line(f"{rel} >> deleted (reappeared by name)")
                except Exception as e:
                    log_line(f"{rel} >> failed delete (by name): {e}")
                continue'''

            # otherwise mark this path as present
            paths_db[rel] = "present"

    # Detect manual deletions since last run:
    for rel, status in list(paths_db.items()):
        folder =rel.split("/")[0]
        folder_path = os.path.join(ROOT, folder)
        if not os.path.exists(folder_path):
            continue

        if status == "present" and rel not in seen_now:
        # file was present previously but missing now -> mark deleted
            paths_db[rel] = "deleted"
            fname = os.path.basename(rel)
            deleted_names.add(fname)
            log_line(f"{rel} >> detected MANUALLY deleted -> marked deleted; added '{fname}' to deleted_names")

    # save db back
    db["paths"] = paths_db
    db["deleted_names"] = sorted(list(deleted_names))
    save_db(db)
    log_line("Scan complete")

if __name__ == "__main__":
    main()
