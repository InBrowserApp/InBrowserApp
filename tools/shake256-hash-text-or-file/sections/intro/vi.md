## SHAKE256 (FIPS 202) là gì?

SHAKE256 (FIPS 202) là hàm đầu ra mở rộng (XOF) thuộc họ SHA-3. Khác với các hàm băm có độ dài cố định, nó có thể trả về số bit đầu ra tùy ý trong khi vẫn duy trì mức an toàn 256 bit. Thuật toán này được NIST chuẩn hóa trong FIPS 202 và dựa trên cấu trúc bọt biển Keccak.

Sự linh hoạt đó rất quan trọng khi giao thức, định dạng tệp hoặc quy tắc checksum nội bộ yêu cầu một độ dài digest cụ thể. Trong công cụ này, bạn có thể băm văn bản thuần hoặc tệp đã tải lên và chọn độ dài đầu ra theo bit, miễn là đó là bội số của 8.

Các trường hợp sử dụng phổ biến gồm băm giao thức, dẫn xuất khóa, digest mật mã có độ dài linh hoạt và các quy trình toàn vẹn dữ liệu nơi cùng đầu vào và cùng độ dài đầu ra luôn phải cho cùng một kết quả.
