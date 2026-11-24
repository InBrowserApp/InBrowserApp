"""Add missing ASCII to the bundled CJK fallback without replacing its glyphs."""

from copy import deepcopy
from pathlib import Path
import sys

from fontTools import version
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.ttLib.scaleUpem import scale_upem


def add_latin(latin_path: Path, fallback_path: Path) -> None:
    with TTFont(latin_path, recalcTimestamp=False) as latin:
        with TTFont(fallback_path, recalcTimestamp=False) as fallback:
            missing = set(range(0x20, 0x7F)) - fallback.getBestCmap().keys()
            subset = Subsetter(
                options=Options(recalc_timestamp=False, layout_features=[], hinting=False)
            )
            subset.populate(unicodes=missing)
            subset.subset(latin)
            scale_upem(latin, fallback["head"].unitsPerEm)

            names = {
                name: f"archive-ascii-{index}"
                for index, name in enumerate(latin.getGlyphOrder())
            }
            glyph_order = fallback.getGlyphOrder() + list(names.values())
            for source, target in names.items():
                glyph = deepcopy(latin["glyf"][source])
                if glyph.isComposite():
                    for component in glyph.components:
                        component.glyphName = names[component.glyphName]
                fallback["glyf"][target] = glyph
                fallback["hmtx"].metrics[target] = latin["hmtx"].metrics[source]

            fallback.setGlyphOrder(glyph_order)
            ascii_cmap = {code: names[name] for code, name in latin.getBestCmap().items()}
            for table in fallback["cmap"].tables:
                if table.isUnicode():
                    for code, name in ascii_cmap.items():
                        table.cmap.setdefault(code, name)

            family = {
                1: "Archive CJK Fallback",
                4: "Archive CJK Fallback Regular",
                6: "ArchiveCJKFallback-Regular",
                16: "Archive CJK Fallback",
            }
            for record in fallback["name"].names:
                if record.nameID in family:
                    record.string = family[record.nameID]
            fallback.save(fallback_path)


if __name__ == "__main__":
    if version != "4.61.1":
        raise SystemExit("Use fontTools 4.61.1 to rebuild the CJK fallback.")
    add_latin(Path(sys.argv[1]), Path(sys.argv[2]))
