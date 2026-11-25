## How to convert a Jupyter Notebook to PDF

Open or drop a saved `.ipynb` file from Jupyter, Google Colab, or VS Code. Check the notebook preview, choose A4 or US Letter, and select **Save as PDF**. In the browser print dialog, choose **Save as PDF** as the destination. You can also choose a printer from that dialog. For example, `analysis.ipynb` becomes a PDF you can attach to an email or submit with a report.

## What is included in the PDF

The PDF follows the notebook's cell order. It includes Markdown headings and tables, source code, and supported saved outputs such as console text, tables and embedded chart images. Long code lines wrap to fit the paper. Long cells can continue on another page, and the browser keeps the text selectable.

Save the notebook with its outputs before converting it if you want the latest results. The converter reads the saved file locally and never runs cells. Widgets need a saved static representation to appear. LaTeX source stays as text, and remote images and other external resources are not fetched.

## Other ways to use the notebook

Use the [Jupyter Notebook Viewer](../notebook-viewer/) to read cells and saved outputs interactively. Use the [Jupyter Notebook Converter](../notebook-export/) if you need HTML, Markdown or a code script.
