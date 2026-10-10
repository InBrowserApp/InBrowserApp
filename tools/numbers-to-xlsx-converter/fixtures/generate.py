"""Generate owned fixtures; requires numbers-parser 4.20.0."""
from datetime import datetime, timedelta
from pathlib import Path
from numbers_parser import Document

folder = Path(__file__).parent
doc = Document(sheet_name="数据 / العربية: [2026]?", table_name="Budget",
               num_rows=5, num_cols=4, num_header_rows=0, num_header_cols=0)
table = doc.sheets[0].tables[0]
for row, column, value in [
    (0, 0, "00123"), (0, 1, 123.75), (1, 0, True),
    (1, 1, datetime(2026, 10, 10, 12, 30)), (2, 0, "=literal"),
    (2, 1, "中文 🚀 العربية"), (3, 0, timedelta(hours=26, minutes=30)),
    (4, 0, "Merged"),
]:
    table.write(row, column, value)
table.merge_cells("A5:B5")
doc.sheets[0].add_table("Budget / Q4", num_rows=2, num_cols=2,
                        num_header_rows=0, num_header_cols=0).write(0, 0, "second table")
doc.add_sheet("Empty", "No data", num_rows=2, num_cols=2)
doc.add_sheet("A very long worksheet name that exceeds Excel limits", "Repeated",
              num_rows=1, num_cols=1)
doc.sheets[-1].tables[0].write(0, 0, "last")
for sheet_id in doc._model.sheet_ids():
    for table_id in doc._model.table_ids(sheet_id):
        model = doc._model.objects[table_id]
        field = next(field for field in model.DESCRIPTOR.fields if field.number == 4)
        store = getattr(model, field.name)
        if not store.rowTileTree.nodes:
            store.rowTileTree.nodes.add(key=0, value=0)
doc.save(folder / "typed.numbers")
doc.save(folder / "protected.numbers", password="owned-password")

rows = Document(sheet_name="Rows", table_name="Data", num_rows=300, num_cols=2,
                num_header_rows=0, num_header_cols=0)
for index in range(300):
    rows.sheets[0].tables[0].write(index, 0, index)
    rows.sheets[0].tables[0].write(index, 1, "行 " + str(index))
rows.save(folder / "partial-tile.numbers")
rows = Document(folder / "partial-tile.numbers")
for sheet_id in rows._model.sheet_ids():
    for table_id in rows._model.table_ids(sheet_id):
        model = rows._model.objects[table_id]
        field = next(field for field in model.DESCRIPTOR.fields if field.number == 4)
        store = getattr(model, field.name)
        del store.rowTileTree.nodes[:]
        for index in range(len(store.tiles.tiles)):
            store.rowTileTree.nodes.add(key=index * 256, value=index)
rows.save(folder / "multi-tile.numbers")
