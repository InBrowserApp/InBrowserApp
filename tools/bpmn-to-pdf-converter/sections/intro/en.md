## Convert a BPMN 2.0 file to PDF

1. Drag a `.bpmn` or `.xml` file onto the converter or select **Open BPMN file**. If you want to see the result first, select **Try an example** to load an approval process.
2. Check the diagram in the preview and choose **Original diagram size**, **A4**, or **US Letter** under **PDF page size**.
3. Select **Download PDF**. The PDF keeps the source filename and contains the whole process, even if you zoom in on part of the preview.

## Choose a PDF size for sharing or printing

Original diagram size is useful when sharing a large process map on screen. Choose A4 or US Letter to fit it onto one sheet with margins. The converter picks portrait or landscape based on the diagram's shape. Check small labels before printing a dense process on one sheet.

The PDF stores shapes and connections as vectors so they stay sharp when enlarged. Use **Download SVG** if you want to place the diagram in a web page or edit it in a vector editor. Keep the BPMN source if you plan to change the process in your modeling tool.

The PDF stores labels as vector outlines. Use the source file to copy or edit the label text.

## Open BPMN XML with the diagram layout included

The converter uses BPMN Diagram Interchange to find the positions of activities, lanes, events, and connections. If the XML only describes the process, open it in your modeling tool and export it again with its diagram layout. XML from other formats, such as a native draw.io file, needs to be exported as BPMN 2.0 with layout data first.

The file is read and converted locally in your browser. To inspect a process and navigate the diagram, use the [BPMN Viewer](../bpmn-viewer/).
