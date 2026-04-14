## SHA-1 là gì?

SHA-1 (Secure Hash Algorithm 1) là một hàm băm mật mã tạo ra giá trị băm 160-bit (20-byte), thường được hiển thị dưới dạng số thập lục phân 40 ký tự. Nó được thiết kế bởi NSA và xuất bản bởi NIST năm 1995 như một phần của Tiêu chuẩn Chữ ký Số.

**Đặc điểm chính:**

- **Xác định**: Cùng một đầu vào luôn tạo ra cùng một băm
- **Tính toán nhanh**: Nhanh chóng tính toán cho bất kỳ đầu vào nào
- **Hiệu ứng tuyết lở**: Những thay đổi nhỏ trong đầu vào tạo ra đầu ra hoàn toàn khác biệt
- **Không thể đảo ngược**: Không thể tính toán để đảo ngược băm để tìm đầu vào gốc
- **Dễ bị va chạm**: Các lỗ hổng đã biết làm cho việc tìm ra va chạm trở nên khả thi

**Tình trạng bảo mật:**
⚠️ **SHA-1 đã bị phá vỡ về mặt mật mã và không nên được sử dụng cho các ứng dụng quan trọng về bảo mật**. Các cuộc tấn công lý thuyết được chứng minh vào năm 2005, và các cuộc tấn công va chạm thực tế được thực hiện vào năm 2017.

**Sử dụng phổ biến (lịch sử):**

- Chữ ký số và chứng chỉ (đã lỗi thời)
- Hệ thống kiểm soát phiên bản Git (để tương thích)
- Hệ thống cũ yêu cầu SHA-1
- Xác minh tính toàn vẹn tệp (không quan trọng về bảo mật)
- Thuật toán proof-of-work (một số tiền điện tử cũ hơn)

**Các lựa chọn thay thế được đề xuất:**

- SHA-256 hoặc SHA-3 cho các ứng dụng mới
- SHA-512 cho yêu cầu bảo mật cao
