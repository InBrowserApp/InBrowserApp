## Công cụ này làm gì

Image Palette Extractor tìm các màu chủ đạo trong ảnh ngay trong trình duyệt
của bạn. Công cụ lấy mẫu ảnh, nhóm các điểm ảnh trông tương tự nhau, rồi trả
về một bảng màu thiết thực với giá trị HEX, RGB, HSL và tỷ lệ
phần trăm cho từng màu.

## Trường hợp sử dụng phù hợp

- Lấy màu thương hiệu hoặc màu sản phẩm từ ảnh chụp màn hình, logo, ảnh chụp,
  hoặc mockup.
- Tạo nhanh bảng màu CSS cho trang đích, hình thu nhỏ hoặc bàn giao thiết kế.
- So sánh mức độ một ảnh được chi phối bởi một màu chủ đạo so với các màu
  nhấn hỗ trợ.
- Làm việc với ảnh riêng tư mà không gửi tệp lên máy chủ.

## Tùy chọn xuất

Kết quả có thể được sao chép dưới dạng danh sách HEX thuần, thuộc tính tùy
chỉnh CSS hoặc JSON. Định dạng CSS hữu ích khi bạn muốn các biến như
`--palette-1`, trong khi JSON giữ các định dạng màu và tỷ lệ chiếm ưu thế cùng
nhau cho script hoặc tự động hóa thiết kế.

## Những điều cần lưu ý

- Việc trích xuất bảng màu mang tính xấp xỉ. Mục đích là tạo ra các nhóm màu
  trực quan hữu ích, không phải bản kiểm kê đầy đủ mọi màu điểm ảnh.
- Các điểm ảnh trong suốt được bỏ qua theo mặc định để biểu tượng và ảnh tách
  nền không làm lệch bảng màu; hãy tắt tùy chọn đó khi chính độ trong suốt là
  một phần của tác phẩm.
- Thiết lập chất lượng chính xác lấy mẫu nhiều điểm ảnh hơn và có thể chậm hơn
  trên ảnh rất lớn.
