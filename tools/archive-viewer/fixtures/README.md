# Archive Viewer fixtures

The following samples are from libarchive 3.8.11. The upstream `.uu` files
were uudecoded, and the ISO sample was also decompressed. See the
[libarchive notice](../../../apps/web/public/licenses/archive-viewer.txt).

| Local sample         | Upstream sample                                  |
| -------------------- | ------------------------------------------------ |
| `empty.7z`           | `test_read_format_7zip_empty_archive.7z`         |
| `solid.7z`           | `test_read_format_7zip_lzma1_lzma2.7z`           |
| `solid-zstd.7z`      | `test_read_format_7zip_solid_zstd.7z`            |
| `rar4.rar`           | `test_read_format_rar.rar`                       |
| `rar5-solid.rar`     | `test_read_format_rar5_multiple_files_solid.rar` |
| `rar5-encrypted.rar` | `test_read_format_rar5_encrypted.rar`            |
| `sample.cab`         | `test_read_format_cab_2.cab`                     |
| `sample.cpio`        | `test_read_format_cpio_bin_le.cpio`              |
| `sample.iso`         | `test_read_format_iso_joliet.iso.Z`              |
| `sample.lzh`         | `test_read_format_lha_header2.lzh`               |
| `japanese.lzh`       | `test_read_format_lha_filename_cp932.lzh`        |

The remaining files were created for the tool tests. Their content is
`hello archive\n` except for `empty.txt.zst` (no content), `sample.txt.Z`
(`abc\n`), and `sample.tar.zst` (a second file containing `second entry\n`).
