# MHTML HTML export

Local `.mhtml` and `.mht` multipart/related archives are converted to a single
UTF-8 HTML file. The converter uses the existing disposable archive worker and
resource resolver. Relative Content-Location and Content-ID resources are
embedded, with no live fetch fallback. Text stays selectable; there is no PDF,
rasterization or print-dialog requirement.

## Static output and links

The shared web-document sanitizer produces both the preview and standalone
output. A leading CSP blocks scripts, forms, base URLs and remote resources;
an explicit UTF-8 declaration preserves non-ASCII text when opened as a local
file. Only embedded supported raster images and font data may load. CSS is
sanitized before serialization. Scripts, forms, redirects, SVG, MathML and
embedded apps are removed. Existing reading styles keep the content readable;
complex archived layouts and fonts can differ from the original website.

Preview links stay inert and use parent-controlled navigation. Export links are
created directly from sanitizer-validated hrefs, with local fragments retained
and HTTP(S)/mailto links carrying safe opener/referrer attributes. Forged link
metadata cannot become an active export URL. Selecting an external link is a
separate action that may contact the destination.

## Completeness and lifecycle

Incomplete archives, unsupported encodings, additional pages, missing resources
and corrupt embedded raster images prevent a download. Image validation covers
both HTML images and CSS image URLs, runs without network access, and is
cancellable. The original archive URL is not visited or used as a base.

The shared preview frame retains zoom, reading position, safe link handling,
image-error reporting and keyboard focus behavior. Cancel, replace and close
abort active work and remove stale downloads. No arbitrary size or page quotas
are imposed; actual browser allocation failures are reported when possible.

## Verification

Genuine Chromium and html-docx-js captures in `tools/mhtml-viewer/fixtures`
provide independent producer coverage. Their provenance is documented there.
Targeted MIME fixtures cover Content-ID, relative paths, duplicate basenames,
Unicode, active content, missing resources and malformed input. Production
browser, offline export and CI results are recorded in the pull request.
