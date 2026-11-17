# Parquet fixtures

These are synthetic files generated locally with PyArrow 26.0.1; they contain no external or private data.

- `sample.parquet`: 125 rows in three Snappy row groups, including exact 64-bit IDs, Unicode names, nulls, booleans, floats, lists, and structs. This is the built-in browser sample.
- `snappy.parquet`, `gzip.parquet`, `brotli.parquet`, `zstd.parquet`, `lz4.parquet`, `none.parquet`: the same three-row edge-case table with quoted/multiline/empty text, signed 64-bit integers, binary (including empty bytes), microsecond timestamps, and decimals. Two row groups exercise boundaries. The empty LZ4 dictionary page reproduces the upstream decompressor edge case handled in `session.ts`.
- `empty.parquet`: the sample schema with zero rows.
- `batches.parquet`: 2,105 integer rows in Gzip row groups, exercising three export batches.

The default Parquet data-page version is 1.0. `lz4.parquet` uses the modern `LZ4_RAW` codec emitted by PyArrow. Only `sample.parquet` is imported by the application; the remaining fixtures are test inputs.
