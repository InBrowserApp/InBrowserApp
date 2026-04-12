## Trình định dạng mã Prettier là gì?

Trình định dạng mã Prettier chạy trực tiếp pipeline Prettier standalone chính
thức ngay trong trình duyệt, giúp bạn chuẩn hóa tệp nguồn mà không cần gửi mã
lên máy chủ. Nó hữu ích khi bạn cần định dạng nhanh, muốn so sánh các thiết
lập độ rộng dòng khác nhau, hoặc cần một tệp sạch để sao chép hay tải xuống
ngay lập tức.

## Định dạng được hỗ trợ

Bản rewrite này tập trung vào những định dạng mà Prettier đã xử lý tốt trong
trình duyệt: JavaScript, TypeScript, Flow, JSON, HTML, CSS, SCSS, Less,
Markdown, MDX, YAML, GraphQL, cùng các định dạng mẫu liên quan như Vue và
Handlebars. Bộ chọn ngôn ngữ quyết định parser nào sẽ chạy, và khi nhập tệp
thì parser sẽ được tự động phát hiện nếu phần mở rộng được nhận diện.

## Cách bản rewrite này hoạt động

Bản rewrite giữ logic định dạng nặng ra khỏi luồng UI chính. Yêu cầu định dạng
được tạo từ cấu hình thuần của tool, rồi chạy qua pipeline Prettier dùng worker
theo kiểu lazy để việc gõ bình thường vẫn mượt. Với đầu vào lớn, chế độ định
dạng tự động sẽ tạm dừng và chuyển sang nút `Định dạng ngay`, cách này dễ dự đoán
hơn so với việc cố định dạng lại một tệp lớn ở mỗi lần gõ phím.
