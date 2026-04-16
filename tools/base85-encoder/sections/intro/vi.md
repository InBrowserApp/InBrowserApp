## Base85 là gì?

Base85 là một dạng mã hóa từ nhị phân sang văn bản, biến 4 byte thành 5 ký tự có thể in được. Nó cô đọng hơn Base64 và công cụ này cho phép bạn chọn ASCII85 hoặc Z85 tùy theo định dạng mà bên nhận yêu cầu.

## Khi nào nên dùng?

- Khi bạn cần mã hóa byte thô, văn bản hoặc tệp cho các kênh chỉ hỗ trợ văn bản nhưng vẫn muốn giữ đầu ra tương đối gọn.
- Dùng ASCII85 khi bạn cần định dạng Base85 linh hoạt có thể xử lý các byte dư ở cuối.
- Dùng Z85 khi bạn cần văn bản Base85 tương thích ZeroMQ và độ dài đầu vào là bội số chính xác của 4 byte.

## Cần lưu ý gì?

- Base85 là định dạng mã hóa, không phải mã hóa bảo mật.
- ASCII85 và Z85 dùng các bảng ký tự khác nhau nên không thể thay thế trực tiếp cho nhau.
- Z85 từ chối dữ liệu có độ dài byte không chia hết cho 4, còn ASCII85 có thể mã hóa các khối cuối không đầy đủ.
