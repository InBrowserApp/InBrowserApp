## RIPEMD-160 là gì?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) là một hàm băm mật mã tạo ra giá trị băm 160-bit (20-byte), thường được hiển thị dưới dạng số thập lục phân 40 ký tự. Nó được phát triển năm 1996 bởi Hans Dobbertin, Antoon Bosselaers và Bart Preneel như một phần của dự án RACE châu Âu.

**Đặc điểm chính:**

- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Tính toán nhanh**: Tính toán hợp lý nhanh cho bất kỳ đầu vào nào
- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt
- **Kích thước đầu ra cố định**: Luôn tạo ra băm 160-bit bất kể kích thước đầu vào
- **Cấu trúc song song hai dòng**: Sử dụng hai dòng tính toán song song để tăng cường bảo mật

**Tình trạng bảo mật:**
✅ **RIPEMD-160 được coi là an toàn về mặt mật mã** không có các cuộc tấn công thực tế nào được biết đến. Nó cung cấp một biên độ an toàn tốt và vẫn được khuyến nghị cho các ứng dụng mật mã nơi băm 160-bit là đủ.

**Sử dụng phổ biến:**

- Tạo địa chỉ Bitcoin (mã hóa Base58Check)
- Chữ ký số và chứng chỉ
- Xác minh tính toàn vẹn dữ liệu
- Các giao thức mật mã yêu cầu băm 160-bit
- Thay thế cho SHA-1 khi cần thiết

**So sánh với các thuật toán khác:**

- An toàn hơn MD5 và SHA-1
- Đầu ra nhỏ hơn SHA-256 (160-bit vs 256-bit)
- Đặc tính hiệu suất tốt
- Được nghiên cứu kỹ và tin cậy trong cộng đồng mật mã

**Được khuyến nghị cho:**

- Các ứng dụng yêu cầu bảo mật băm 160-bit
- Các hoạt động mật mã liên quan đến Bitcoin
- Tương thích hệ thống cũ nơi RIPEMD-160 được chỉ định
