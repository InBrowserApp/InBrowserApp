## NanoID là gì?

NanoID là trình tạo ID duy nhất nhỏ gọn và an toàn cho URL, được thiết kế cho các ứng dụng web hiện đại, API và công cụ nội bộ. Định dạng mặc định dùng 21 ký tự từ một bảng chữ cái gồm 64 ký tự, mang lại khoảng 126 bit độ ngẫu nhiên nhưng vẫn đủ ngắn cho URL, tên tệp và dữ liệu kiểm thử.

Mọi thứ trong công cụ này đều chạy cục bộ ngay trong trình duyệt của bạn. Bảng chữ cái tùy chỉnh và các ID được tạo ra không rời khỏi trang, vì vậy công cụ này rất phù hợp cho việc dựng prototype nhanh, tạo fixture và các tác vụ vận hành một lần.

**Điểm chính:**

- **An toàn cho URL**: dùng A-Z, a-z, 0-9, - và \_.
- **Có thể tùy chỉnh**: điều chỉnh độ dài và bảng chữ cái theo ràng buộc của bạn.
- **Độ ngẫu nhiên an toàn**: dùng giá trị ngẫu nhiên mật mã ngay trong trình duyệt.
- **Xuất văn bản thuần**: sao chép hoặc tải xuống lô hiện tại khi bạn cần dữ liệu seed, nội dung demo hoặc danh sách sẵn sàng để nhập.

**Hướng dẫn thực tế:**

- Hãy giữ độ dài mặc định 21 ký tự khi bạn cần một mã định danh dùng chung mạnh với xác suất va chạm rất thấp.
- ID ngắn hơn phù hợp cho token UI tạm thời hoặc dữ liệu mock cục bộ, nhưng rủi ro va chạm sẽ tăng khi bạn giảm độ dài hoặc tạo lô lớn hơn.
- Bảng chữ cái lớn hơn mang lại nhiều entropy hơn trên mỗi ký tự, nên bạn thường có thể giữ ID ngắn hơn mà không phải đánh đổi quá nhiều về tính duy nhất.
- Bảng chữ cái tùy chỉnh chỉ nên chứa các ký tự duy nhất. Ký tự trùng lặp làm lệch phân phối, vì vậy công cụ này chặn chúng trước khi tạo kết quả.
