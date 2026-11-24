## Xem trước đồ thị Graphviz DOT trực tuyến

Dán mã DOT từ tệp, tập lệnh hoặc tài liệu vào **Mã nguồn DOT**. Đồ thị cập nhật khi bạn nhập. Dùng `digraph` và `->` cho cạnh có hướng, hoặc `graph` và `--` cho cạnh vô hướng. Các ví dụ có sẵn minh họa đồ thị phụ thuộc, mạng và cụm.

## Chọn bộ máy bố cục

Dùng `dot` cho đồ thị phân tầng; thử `neato` hoặc `fdp` cho mạng vô hướng, `sfdp` cho mạng lớn, `circo` cho bố cục tròn và `twopi` cho cây hướng tâm. `osage` dành cho đồ thị phân cụm, còn `patchwork` cho sơ đồ cây. Mã nguồn được giữ lại khi đổi bộ máy.

## Hiểu lỗi và lưu ý bố cục

Toán tử cạnh không khớp loại đồ thị hoặc thiếu dấu ngoặc nhọn hay dấu nháy có thể gây lỗi. Kiểm tra dòng được báo và dòng trước đó. Bản xem trước vẫn có thể xuất hiện cùng lưu ý về thuộc tính không áp dụng được. Nếu mã có thuộc tính `layout`, Graphviz dùng bộ máy đó. Xem [tài liệu ngôn ngữ DOT](https://graphviz.org/doc/info/lang.html) và [hướng dẫn bố cục Graphviz](https://graphviz.org/docs/layouts/).

## Tải đồ thị dưới dạng SVG

Chọn **Tải SVG** để lưu bố cục hiện tại dưới dạng ảnh vector. **Vừa khung xem** và **Kích thước thực** chỉ thay đổi bản xem trước. Hãy giữ mã nguồn DOT để chỉnh sửa đồ thị sau này.
