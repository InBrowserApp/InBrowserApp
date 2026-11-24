#include <emscripten/emscripten.h>
#include <fynepdf/pdfa/pdfa.h>

extern "C" EMSCRIPTEN_KEEPALIVE const char* convert_pdfa(int part) {
  using namespace fynepdf::pdfa;
  PdfaOptions options;
  options.part = part;
  options.fonts = "/fonts";
  options.flatten_dpi = 0;

  static std::string report;
  report = ToJson(ConvertToPdfa("/input.pdf", "/output.pdf", options));
  return report.c_str();
}
