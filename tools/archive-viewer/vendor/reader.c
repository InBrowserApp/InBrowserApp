#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>
#include <locale.h>
#include <math.h>
#include <stdio.h>

#define BLOCK_SIZE (64 * 1024)

/* One reader per worker. The input callback reads slices of the original File. */
static struct archive *reader;
static struct archive_entry *entry;
static la_int64_t input_size;
static la_int64_t position;
static unsigned char input[BLOCK_SIZE];
static unsigned char output[BLOCK_SIZE];

EM_JS(int, read_file, (double offset, unsigned char *buffer, int length), {
  return Module["readArchiveBytes"](offset, buffer, length);
});

static la_ssize_t read_block(struct archive *archive, void *data,
                             const void **buffer) {
  *buffer = input;
  la_int64_t remaining = input_size - position;
  int length = remaining < BLOCK_SIZE ? (int)remaining : BLOCK_SIZE;
  if (length == 0) return 0;
  if (!read_file((double)position, input, length)) {
    archive_set_error(archive, 0, "Could not read archive bytes");
    return -1;
  }
  position += length;
  return length;
}

static la_int64_t skip_bytes(struct archive *archive, void *data,
                             la_int64_t count) {
  la_int64_t remaining = input_size - position;
  if (count > remaining) count = remaining;
  position += count;
  return count;
}

static la_int64_t seek_bytes(struct archive *archive, void *data,
                             la_int64_t offset, int whence) {
  la_int64_t base = whence == SEEK_END ? input_size :
                    whence == SEEK_CUR ? position : 0;
  if (offset < -base || offset > input_size - base) {
    archive_set_error(archive, 0, "Archive offset is outside the file");
    return ARCHIVE_FATAL;
  }
  position = base + offset;
  return position;
}

EMSCRIPTEN_KEEPALIVE
int viewer_open(double size, int format, int filter, int allow_raw) {
  setlocale(LC_CTYPE, "C.UTF-8");
  input_size = (la_int64_t)size;
  position = 0;
  reader = archive_read_new();
  if (!reader) return ARCHIVE_FATAL;

  if (archive_read_support_format_by_code(reader, format) != ARCHIVE_OK)
    return ARCHIVE_FATAL;
  if (format == ARCHIVE_FORMAT_RAR)
    archive_read_support_format_rar5(reader);
  if (allow_raw) {
    if (format != ARCHIVE_FORMAT_RAW) archive_read_support_format_raw(reader);
    archive_read_support_format_empty(reader);
  }
  if (filter != ARCHIVE_FILTER_NONE &&
      archive_read_support_filter_by_code(reader, filter) != ARCHIVE_OK)
    return ARCHIVE_FATAL;

  archive_read_set_callback_data(reader, NULL);
  archive_read_set_read_callback(reader, read_block);
  archive_read_set_skip_callback(reader, skip_bytes);
  archive_read_set_seek_callback(reader, seek_bytes);
  int status = archive_read_open1(reader);
  if (status == ARCHIVE_OK && filter != ARCHIVE_FILTER_NONE &&
      (archive_filter_code(reader, 0) != filter || archive_filter_count(reader) != 2)) {
    archive_set_error(reader, 0, "Archive compression does not match its format");
    return ARCHIVE_FATAL;
  }
  return status;
}

EMSCRIPTEN_KEEPALIVE
void viewer_close(void) {
  if (reader) archive_read_free(reader);
  reader = NULL;
  entry = NULL;
}

EMSCRIPTEN_KEEPALIVE
int viewer_next(void) {
  return archive_read_next_header(reader, &entry);
}

EMSCRIPTEN_KEEPALIVE
const char *viewer_error(void) {
  return reader ? archive_error_string(reader) : NULL;
}

EMSCRIPTEN_KEEPALIVE
int viewer_format(void) {
  return archive_format(reader) & ARCHIVE_FORMAT_BASE_MASK;
}

EMSCRIPTEN_KEEPALIVE
const char *viewer_path(void) {
  const char *path = archive_entry_pathname_utf8(entry);
  return path ? path : archive_entry_pathname(entry);
}

EMSCRIPTEN_KEEPALIVE
int viewer_kind(void) {
  if (archive_entry_hardlink(entry)) return 0;
  return archive_entry_filetype(entry);
}

EMSCRIPTEN_KEEPALIVE
double viewer_size(void) {
  return (double)archive_entry_size(entry);
}

EMSCRIPTEN_KEEPALIVE
double viewer_mtime(void) {
  if (!archive_entry_mtime_is_set(entry)) return NAN;
  return (double)archive_entry_mtime(entry) * 1000 +
         (double)archive_entry_mtime_nsec(entry) / 1000000;
}

EMSCRIPTEN_KEEPALIVE
int viewer_encrypted(void) {
  return archive_entry_is_encrypted(entry);
}

EMSCRIPTEN_KEEPALIVE
int viewer_read(void) {
  return (int)archive_read_data(reader, output, BLOCK_SIZE);
}

EMSCRIPTEN_KEEPALIVE
const unsigned char *viewer_buffer(void) {
  return output;
}
