# Tạo tệp lịch ngay trong trình duyệt

Công cụ này tạo tệp sự kiện `.ics` tiêu chuẩn ngay trong trình duyệt của bạn. Bạn có thể thiết lập sự kiện theo giờ hoặc cả ngày, chọn chiến lược múi giờ, thêm lời nhắc và xuất mục lịch hoàn chỉnh mà không cần đồng bộ dữ liệu lên máy chủ.

## Vì sao nên dùng

- Phù hợp khi bạn chỉ cần một tệp lịch chứ không cần toàn bộ quy trình tài khoản lịch.
- Giữ lịch nhạy cảm ở máy cục bộ nhưng vẫn tạo được tệp đính kèm sự kiện theo chuẩn.
- Cho phép điều chỉnh quy tắc lặp lại và lời nhắc trước khi tải xuống tệp `.ics` cuối cùng.

## Quy trình gợi ý

1. Điền tóm tắt sự kiện, địa điểm, ghi chú và URL tham chiếu nếu cần.
2. Chọn khoảng thời gian của sự kiện, rồi quyết định xuất dấu thời gian `UTC` hay giữ múi giờ gốc bằng `TZID`.
3. Chỉ thêm quy tắc lặp lại và lời nhắc khi cần, sau đó tải tệp xuống và đính kèm ở nơi bạn chia sẻ sự kiện.

## Lưu ý

- Đầu ra `UTC` thường là lựa chọn an toàn nhất khi bạn cần khả năng tương thích rộng với lịch.
- Đầu ra `TZID` giữ lại ngữ cảnh lập lịch gốc cho các ứng dụng hỗ trợ múi giờ có tên.
- Với sự kiện cả ngày, biểu mẫu giữ ngày kết thúc theo kiểu bao gồm ngày cuối, dù tệp ICS lưu nó như ngày kết thúc loại trừ.
