## Keccak là gì?

Keccak là một họ các hàm băm mật mã phục vụ như nền tảng cho tiêu chuẩn SHA-3 (Secure Hash Algorithm 3). Được phát triển bởi Guido Bertoni, Joan Daemen, Michaël Peeters và Gilles Van Assche, nó đã thắng cuộc thi hàm băm NIST năm 2012.

**Đặc điểm chính:**

- **Cấu trúc bọt biển**: Sử dụng thiết kế hàm bọt biển sáng tạo với các giai đoạn hấp thụ và vắt
- **Độ dài đầu ra thay đổi**: Có thể tạo ra đầu ra băm với bất kỳ độ dài mong muốn nào
- **Biên độ bảo mật cao**: Được thiết kế với dự trữ bảo mật đáng kể
- **Khác với SHA-1/SHA-2**: Dựa trên các nguyên lý toán học hoàn toàn khác
- **Biến thể Keccak[c=2d]**: Triển khai này sử dụng đặc tả Keccak gốc với dung lượng c = 2d (trong đó d là độ dài đầu ra)

**Sự khác biệt giữa Keccak và SHA-3 (FIPS 202):**
🔍 **Phân biệt quan trọng**: Keccak gốc và SHA-3 được tiêu chuẩn hóa **không giống nhau**:

- **Keccak gốc**: Sử dụng dung lượng c = 2d và padding khác (padding Keccak: 0x01)
- **FIPS 202 SHA-3**: Sử dụng dung lượng c = 2d nhưng padding khác (padding SHA-3: 0x06)
- **Tách biệt miền**: Sự khác biệt padding đảm bảo Keccak và SHA-3 tạo ra đầu ra khác nhau cho cùng đầu vào
- **Công cụ này triển khai**: **Đặc tả Keccak gốc** với tham số hóa Keccak[c=2d]

**Tình trạng bảo mật:**
✅ **Keccak được coi là rất an toàn** không có cuộc tấn công thực tế nào được biết đến. Nó cung cấp biên độ bảo mật xuất sắc và khả năng chống lại các kỹ thuật phân tích mật mã khác nhau.

**Sử dụng phổ biến:**

- Blockchain Ethereum (sử dụng Keccak-256 gốc)
- Nghiên cứu học thuật và các giao thức mật mã
- Các ứng dụng yêu cầu đầu ra băm có độ dài thay đổi
- Các hệ thống cần thay thế cho họ SHA-2
- Triển khai blockchain và tiền điện tử

**Ưu điểm so với băm truyền thống:**

- Thiết kế cơ bản khác giảm nguy cơ các cuộc tấn công liên quan
- Độ dài đầu ra linh hoạt (không giới hạn ở kích thước cố định)
- Nền tảng bảo mật lý thuyết mạnh mẽ
- Kháng cự với các cuộc tấn công mở rộng độ dài
- Hiệu suất xuất sắc trên nhiều nền tảng khác nhau

**Ghi chú kỹ thuật:**

- **Keccak-256**: Tạo ra đầu ra 256-bit (biến thể phổ biến nhất)
- **Công thức dung lượng**: c = 2d đảm bảo mức bảo mật phù hợp
- **Sử dụng Ethereum**: Ethereum đặc biệt sử dụng Keccak-256 gốc, không phải SHA3-256
