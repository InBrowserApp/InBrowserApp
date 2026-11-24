cmake_minimum_required(VERSION 3.20)
project(browser_pdfa LANGUAGES C CXX)

if(NOT EMSCRIPTEN)
  message(FATAL_ERROR "Build this adapter with emcmake.")
endif()

add_library(qpdf_archive STATIC IMPORTED)
set_target_properties(qpdf_archive PROPERTIES
  IMPORTED_LOCATION "${QPDF_BUILD}/libqpdf/libqpdf.a"
  INTERFACE_INCLUDE_DIRECTORIES "${QPDF_SOURCE}/include")

add_library(jpeg_archive STATIC IMPORTED)
set_target_properties(jpeg_archive PROPERTIES
  IMPORTED_LOCATION "${PORTS_LIB}/libjpeg.a"
  INTERFACE_INCLUDE_DIRECTORIES "${PORTS_INCLUDE}")

add_library(openjpeg_archive STATIC IMPORTED)
set_target_properties(openjpeg_archive PROPERTIES
  IMPORTED_LOCATION "${OPENJPEG_BUILD}/bin/libopenjp2.a"
  INTERFACE_INCLUDE_DIRECTORIES "${OPENJPEG_SOURCE}/src/lib/openjp2;${OPENJPEG_BUILD}/src/lib/openjp2")

file(GLOB lcms_sources "${LCMS_SOURCE}/src/*.c")
add_library(browser_lcms STATIC ${lcms_sources})
target_include_directories(browser_lcms PUBLIC "${LCMS_SOURCE}/include")
target_compile_definitions(browser_lcms PRIVATE CMS_NO_PTHREADS)

set(FYNEPDF_PDFA_QPDF_TARGET qpdf_archive)
set(FYNEPDF_PDFA_JPEG_TARGET jpeg_archive)
set(FYNEPDF_PDFA_OPENJPEG_TARGET openjpeg_archive)
set(FYNEPDF_PDFA_LCMS_TARGET browser_lcms)
add_subdirectory("${FYNEPDF_SOURCE}" fynepdf)

add_executable(fynepdf bridge.cpp)
set_target_properties(fynepdf PROPERTIES SUFFIX ".mjs")
set_property(TARGET fynepdf APPEND PROPERTY LINK_DEPENDS
  "${FYNEPDF_SOURCE}/fonts/DroidSansFallbackFull.ttf")
target_link_libraries(fynepdf PRIVATE fynepdf::pdfa "${PORTS_LIB}/libz.a")
target_link_options(fynepdf PRIVATE
  -fexceptions
  -sMODULARIZE
  -sEXPORT_ES6
  -sENVIRONMENT=worker,node
  -sALLOW_MEMORY_GROWTH
  -sNO_EXIT_RUNTIME
  "-sEXPORTED_RUNTIME_METHODS=ccall,FS"
  "SHELL:--embed-file \"${FYNEPDF_SOURCE}/fonts@/fonts\""
  --no-entry)
