## Tạo VIN ngẫu nhiên để thử nghiệm

Chọn số lượng từ `1` đến `1000`, rồi chọn **Tạo**. Mỗi dòng chứa một mã số nhận dạng xe (VIN) gồm 17 ký tự. Chọn **Sao chép tất cả** để dán cả danh sách vào biểu mẫu thử nghiệm hoặc bảng tính, hoặc chọn **Tải TXT** để lưu tệp văn bản với mỗi VIN trên một dòng.

## Đọc VIN và chữ số kiểm tra

Ba ký tự đầu tạo thành mã nhận dạng nhà sản xuất. Ký tự thứ tư đến thứ tám mô tả xe, còn ký tự thứ chín là chữ số kiểm tra. Tám ký tự cuối tạo thành phần nhận dạng xe. Các chữ cái `I`, `O` và `Q` được loại bỏ để tránh nhầm với chữ số. Chữ số kiểm tra được tính từ 16 ký tự còn lại và có thể là một chữ số từ `0` đến `9` hoặc `X`. Ví dụ, trong `1M8GDM9AXKP042788`, ký tự thứ chín là `X`.

## Dùng VIN mẫu trong dữ liệu thử nghiệm

Dùng các VIN được tạo để kiểm thử trường bắt buộc, nhập dữ liệu hàng loạt hoặc xác thực định dạng và chữ số kiểm tra. Để kiểm thử trường hợp bị từ chối, chỉ thay ký tự thứ chín bằng một chữ số khác rồi gửi lại giá trị. Công cụ tạo VIN giả lập, vì vậy những phần trông giống mã nhà sản xuất, năm đời xe hoặc số sê-ri chỉ nên được xem là dữ liệu mẫu. Để đăng ký, tra cứu phụ tùng hoặc lịch sử xe, hãy dùng VIN ghi trên xe hoặc giấy tờ của xe.
