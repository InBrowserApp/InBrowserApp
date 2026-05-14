## What is an X.509 certificate parser?

Chứng chỉ X.509 là một tài liệu đã ký liên kết khóa công khai với một danh tính như tên miền, dịch vụ, tổ chức hoặc cá nhân. Chứng chỉ TLS, tệp chuỗi chứng chỉ và nhiều quy trình S/MIME hoặc ký số dùng định dạng này.

Trình phân tích này đọc trực tiếp chứng chỉ và khóa công khai trong trình duyệt của bạn. Nó có thể kiểm tra các khối PEM, tệp DER nhị phân và văn bản base64 DER, rồi hiển thị subject, issuer, số sê-ri, khoảng hiệu lực, thuật toán chữ ký, thuật toán khóa công khai, fingerprint và các extension phổ biến.

Dùng công cụ này khi bạn cần so sánh fingerprint của chứng chỉ, kiểm tra chứng chỉ có dành cho máy chủ mong đợi hay không, xem Subject Alternative Names, xác nhận key usage hoặc trích xuất chi tiết khóa công khai khi gỡ lỗi TLS và sự cố triển khai.

Công cụ không xác thực chuỗi tin cậy hoặc liên hệ với tổ chức phát hành chứng chỉ. Nó hiển thị những gì được mã hóa trong chứng chỉ hoặc khóa công khai bạn cung cấp, vì vậy hãy dùng một trình quét TLS chuyên dụng khi bạn cần xác thực thu hồi, chuỗi, hostname hoặc endpoint trực tiếp.

- So sánh fingerprint SHA-256 hoặc SHA-1 trước khi cài đặt hoặc xoay vòng chứng chỉ.
- Xem lại SAN, key usage, extended key usage và basic constraints mà không tải tài liệu chứng chỉ lên.
- Kiểm tra khóa công khai SPKI độc lập khi một dịch vụ chỉ cung cấp cho bạn tệp khóa công khai PEM hoặc DER.
