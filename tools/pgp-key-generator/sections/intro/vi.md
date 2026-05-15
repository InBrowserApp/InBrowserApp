# Trình tạo khóa PGP

Sử dụng công cụ này để tạo cặp khóa OpenPGP trực tiếp trong trình duyệt của bạn. Công cụ tạo khóa công khai armored, khóa riêng, chứng chỉ thu hồi, ID khóa và dấu vân tay để bạn có thể thiết lập email mã hóa, mã hóa tệp, ký bản phát hành hoặc quy trình khôi phục tài khoản mà không gửi dữ liệu khóa lên máy chủ.

## Khi nào nên sử dụng

Khóa PGP hữu ích khi bạn cần mật mã bất đối xứng: người khác dùng khóa công khai của bạn để mã hóa dữ liệu cho bạn hoặc xác minh chữ ký, còn khóa riêng của bạn dùng để giải mã dữ liệu và tạo chữ ký. Trình tạo dựa trên trình duyệt thuận tiện cho các phiên thiết lập ngắn, bản demo hoặc quy trình cục bộ khi bạn muốn có kết quả ngay.

## Cách tạo cặp khóa

Nhập tên, email hoặc cả hai để khóa có ID người dùng dễ nhận biết. Thêm ghi chú tùy chọn nếu bạn muốn tách riêng khóa cho công việc, dự án hoặc ký bản phát hành. Chọn ECC cho phần mềm OpenPGP hiện đại, hoặc RSA khi bạn cần tương thích với công cụ cũ. Cụm mật khẩu là tùy chọn, nhưng rất được khuyến nghị cho bất kỳ khóa riêng nào bạn định lưu giữ.

## Loại khóa và thời hạn

ECC sử dụng Curve25519 và là mặc định vì nhỏ gọn và nhanh. RSA có các tùy chọn 2048, 3072 và 4096 bit để phục vụ khả năng tương thích. Thời hạn được đặt theo ngày; chỉ dùng 0 cho các khóa mà bạn chủ động quản lý và có thể thu hồi. Khoảng thời hạn ngắn hơn giúp giảm rủi ro dài hạn và dễ hình thành thói quen luân phiên khóa hơn.

## Xử lý khóa riêng an toàn

Tải xuống khóa công khai, khóa riêng và chứng chỉ thu hồi dưới dạng các tệp riêng biệt. Sao lưu khóa riêng trong trình quản lý mật khẩu được mã hóa hoặc bộ nhớ ngoại tuyến an toàn, đồng thời giữ chứng chỉ thu hồi ở một nơi riêng để bạn có thể ngừng sử dụng khóa nếu khóa riêng bị mất hoặc bị lộ. Trước khi công bố khóa công khai, hãy so sánh dấu vân tay qua một kênh đáng tin cậy.
