WebP động có thể giữ chuyển động của GIF trong khi thường tạo ra tệp nhỏ hơn cho trang web, bản xem trước sản phẩm, tài liệu và nội dung dễ chia sẻ trong trò chuyện. Bộ chuyển đổi này chạy cục bộ và, khi bạn giữ các thiết lập tỷ lệ, tốc độ và lặp mặc định, sẽ đưa GIF gốc qua bộ mã hóa `gif2webp` min-size không mất dữ liệu trước khi xuất tệp `.webp`.

## Khi nào nên dùng

Dùng công cụ này khi bạn có GIF động cần một định dạng web hiện đại hơn, đặc biệt cho các trang mà dung lượng tệp và tốc độ tải quan trọng. WebP động được các trình duyệt lớn hiện nay hỗ trợ và có thể giữ độ trong suốt, thời gian phát và hành vi lặp.

## Tùy chọn chuyển đổi

Tỷ lệ thay đổi mọi khung hình trước khi mã hóa, hữu ích khi GIF lớn hơn vị trí nó sẽ được hiển thị. Tốc độ thay đổi thời gian phát mà không bỏ khung hình. Hành vi lặp có thể theo GIF nguồn, buộc phát vô hạn hoặc dùng số lần tùy chỉnh cho những nội dung cần dừng sau một số lần phát cụ thể. Giữ tỷ lệ ở 100%, tốc độ ở 1x và hành vi lặp đặt thành Follow GIF sẽ dùng luồng min-size không mất dữ liệu mặc định.

## Quyền riêng tư và giới hạn

Quá trình chuyển đổi chạy trong trình duyệt của bạn. WebP không mất dữ liệu thường nén ảnh động kiểu GIF tốt hơn, nhưng không thể bảo đảm mọi tệp xuất ra đều nhỏ hơn; GIF rất nhỏ hoặc đã được tối ưu hóa sẵn có thể lớn hơn vì vùng chứa WebP vẫn có phần chi phí bổ sung. Thay đổi tỷ lệ, tốc độ hoặc hành vi lặp yêu cầu giải mã khung hình và có thể dùng nhiều bộ nhớ với GIF rất lớn. Nếu GIF nguồn không chứa siêu dữ liệu lặp, bản xuất mặc định sẽ phát một lần trừ khi bạn chọn lặp vô hạn hoặc lặp tùy chỉnh.
