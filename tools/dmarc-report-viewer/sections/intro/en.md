## How to read a DMARC aggregate report

Open the attachment from an aggregate report sent to the `rua` address in your DMARC record. The viewer accepts XML, GZIP, and a ZIP containing one XML report. You can also paste the XML or load the example. The report summary shows who sent the report, the period in UTC, and the domain’s published policy. Files and pasted text are processed in your browser.

## How to interpret the message counts

Each source record groups messages that share a source IP and an evaluation result. It can represent more than one message, and the same IP can appear in multiple records. Totals use the message count from each row. A message passes DMARC when either SPF or DKIM passes with alignment to the visible From domain. Both alignment results must fail for the viewer to count a message as a failure. Incomplete alignment data is shown as unknown.

## Why alignment, authentication, and disposition differ

Expand Raw authentication results to see the reported domains, results, and DKIM selectors. An SPF or DKIM result can pass for a different domain while its DMARC alignment result fails. The applied disposition describes how the receiver handled a group of messages. It can differ from the published policy when the receiver applies an override. Filter by source IP or From domain to inspect a sender without changing the overall totals.

## Which DMARC XML formats are supported

The viewer reads aggregate reports following RFC 9990, including its DMARC namespace, and legacy reports based on RFC 7489. RFC 9990 describes the XML format used to summarize authentication and disposition in aggregate reports. If your mail system packs several reports into one archive, extract the one you want to inspect and open it individually.
