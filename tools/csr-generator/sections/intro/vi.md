# Trình tạo CSR

Yêu cầu ký chứng chỉ (CSR) là một thông điệp PKCS#10 chứa khóa công khai của bạn, các trường Subject định danh, các phần mở rộng tùy chọn như Subject Alternative Names và chữ ký được tạo bằng khóa riêng tương ứng. Tổ chức phát hành chứng chỉ dùng CSR để cấp chứng chỉ X.509 mà không bao giờ nhận khóa riêng của bạn.

Trình tạo này tạo CSR trực tiếp trong trình duyệt của bạn. Bạn có thể tạo một cặp khóa RSA hoặc ECDSA mới, hoặc nhập khóa riêng PEM chưa mã hóa hiện có khi cần gia hạn chứng chỉ cho một khóa đã được triển khai.

## Khi nào nên dùng

Dùng CSR khi bạn cần tổ chức phát hành chứng chỉ cấp hoặc gia hạn chứng chỉ TLS, S/MIME, xác thực máy khách hoặc dịch vụ nội bộ. CSR chứng minh quyền sở hữu khóa riêng và mang thông tin danh tính công khai cần xuất hiện trong chứng chỉ.

Đối với chứng chỉ TLS công khai, hãy đặt tên máy chủ trong Subject Alternative Names. Common Name vẫn hữu ích để dễ đọc và cho các hệ thống cũ, nhưng các máy khách hiện đại xác thực tên DNS và địa chỉ IP từ SAN.

## Cách tạo CSR

Chọn tạo khóa mới hoặc nhập khóa riêng hiện có. Điền các trường Subject cần thiết cho yêu cầu chứng chỉ của bạn, sau đó thêm các mục SAN cho tên DNS, địa chỉ IP, địa chỉ email hoặc URI. Tạo CSR và chỉ gửi CSR PEM cho tổ chức phát hành chứng chỉ của bạn.

Nếu công cụ này tạo khóa mới, hãy tải xuống và lưu trữ khóa riêng trước khi rời khỏi trang. Nếu bạn nhập khóa, công cụ chỉ tạo CSR và không xuất lại khóa riêng đã nhập.

## Ghi chú về khóa và định dạng

RSA 2048 bit tương thích rộng rãi; 3072 hoặc 4096 bit có thể được ưu tiên cho chứng chỉ nội bộ có thời hạn dài hơn. ECDSA P-256 gọn nhẹ và được hỗ trợ rộng rãi, trong khi P-384 hoặc P-521 có thể được yêu cầu bởi các chính sách nghiêm ngặt hơn. Luồng nhập khóa hỗ trợ các khối PEM PKCS#8 chưa mã hóa, RSA PRIVATE KEY và EC PRIVATE KEY.

Khóa riêng là thông tin nhạy cảm. Không dán chúng vào các trang web không đáng tin cậy, không gửi chúng cho tổ chức phát hành chứng chỉ và không commit chúng vào hệ thống quản lý mã nguồn. Công cụ này chạy cục bộ trong trình duyệt, nhưng quy trình vận hành của bạn vẫn cần lưu trữ và luân chuyển khóa an toàn.
