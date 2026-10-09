## Read a saved email locally

Open an EML, Apple Mail EMLX, or Outlook MSG file to inspect the subject, sender, recipients, saved date, message body, and attachments. Use the HTML and plain-text tabs when both alternatives are available. Focus mode gives the message more room, and text-size controls help with long reply threads.

## Privacy and safe reading

Processing happens in your browser. Email contents are not uploaded or automatically stored. Included raster images referenced by content ID can appear in the message; remote images, fonts, stylesheets, active content, and link navigation stay disabled. Attachments are listed with their names, types, and available sizes. They are not opened or executed, and attached emails are not expanded.

## Format compatibility

EML and EMLX support MIME messages, encoded names and subjects, common character sets, text and HTML alternatives, and included attachments. EMLX reads its byte-counted message section; Apple Mail metadata is ignored. Detached attachments from partial Apple Mail downloads are unavailable. A recoverable incomplete message can still be shown with a compatibility note.

MSG supports Outlook email headers, plain text, HTML, attachment information, and included raster images. Outlook rich-text-only bodies are not rendered. Calendar and contact items, encrypted messages, and protected mail are not supported. Complex Outlook formatting can differ from the original application. A saved timestamp retains its original time-zone text when available; MSG timestamps without a transport date are explicitly identified as UTC.

Viewing an email does not verify the sender’s identity or a digital signature. A missing or malformed date is displayed without guessing. Available memory and browser capabilities determine which files can be opened; there is no fixed file-size or attachment-count limit.
