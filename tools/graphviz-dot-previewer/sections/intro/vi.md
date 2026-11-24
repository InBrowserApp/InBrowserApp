## Xem trước đồ thị Graphviz DOT trực tuyến

Dán mã DOT từ tệp, tập lệnh hoặc tài liệu vào **Mã nguồn DOT**. Đồ thị cập nhật khi bạn nhập. Dùng `digraph` và `->` cho cạnh có hướng, hoặc `graph` và `--` cho cạnh vô hướng. Các ví dụ có sẵn minh họa đồ thị phụ thuộc, mạng và cụm.

## Chọn bộ máy bố cục

Dùng `dot` cho đồ thị phân tầng; thử `neato` hoặc `fdp` cho mạng vô hướng, `sfdp` cho mạng lớn, `circo` cho bố cục tròn và `twopi` cho cây hướng tâm. `osage` dành cho đồ thị phân cụm, còn `patchwork` cho sơ đồ cây. Mã nguồn được giữ lại khi đổi bộ máy.

## Hiểu lỗi và lưu ý bố cục

Toán tử cạnh không khớp loại đồ thị hoặc thiếu dấu ngoặc nhọn hay dấu nháy có thể gây lỗi. Kiểm tra dòng được báo và dòng trước đó. Bản xem trước vẫn có thể xuất hiện cùng lưu ý về thuộc tính không áp dụng được. Nếu mã có thuộc tính `layout`, Graphviz dùng bộ máy đó. Xem [tài liệu ngôn ngữ DOT](https://graphviz.org/doc/info/lang.html) và [hướng dẫn bố cục Graphviz](https://graphviz.org/docs/layouts/).

## Xuất đồ thị Graphviz DOT sang SVG hoặc PDF

Chọn **Tải PDF xuống** để lưu toàn bộ đồ thị trên một trang có kích thước vừa với đồ thị. Hình và đường nét vẫn rõ khi phóng to hoặc in. Chọn **Tải SVG** để nhúng đồ thị vào trang web hoặc mở trong trình chỉnh sửa vectơ. **Vừa khung xem** và **Kích thước thực** chỉ thay đổi phần xem trước trên màn hình. Giữ mã nguồn DOT nếu bạn muốn chỉnh sửa đồ thị sau này.
