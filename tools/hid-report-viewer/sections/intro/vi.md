## Cách kết nối thiết bị HID trong trình duyệt

Kết nối một thiết bị giao diện người dùng được hỗ trợ, chẳng hạn tay cầm chơi game, cần điều khiển, bàn đạp hoặc bàn phím macro. Chọn **Kết nối thiết bị** rồi chọn thiết bị trong hộp chọn WebHID. Trình xem hiển thị ID nhà cung cấp (VID) và ID sản phẩm (PID), giúp nhận diện phần cứng. Hãy sử dụng trình duyệt máy tính tương thích qua HTTPS.

## Cách đọc các tập hợp HID và ID báo cáo

Mở một tập hợp để xem trang sử dụng, mục sử dụng và ID báo cáo. Trang sử dụng nhóm các chức năng liên quan, còn mục sử dụng xác định một chức năng trong nhóm đó. Báo cáo đầu vào mang dữ liệu từ thiết bị, báo cáo đầu ra mô tả dữ liệu mà máy chủ có thể gửi, còn báo cáo tính năng mô tả cài đặt hoặc trạng thái riêng của thiết bị. ID báo cáo 0 có nghĩa là giao diện không dùng ID báo cáo tường minh.

## Cách kiểm tra các byte đầu vào thay đổi

Thao tác từng điều khiển một trong khi theo dõi báo cáo hex trực tiếp. Các byte được tô sáng khác với dữ liệu trước đó của cùng ID báo cáo. ID báo cáo được hiển thị riêng với dữ liệu. Tạm dừng thu thập để xem các báo cáo gần nhất, hoặc xóa danh sách và bắt đầu lại. Tra cứu định dạng báo cáo của thiết bị để diễn giải các nút, trục và trường khác.

## Tại sao thiết bị hoặc một tập hợp không xuất hiện?

Kiểm tra xem hệ điều hành có nhận diện thiết bị không, sau đó mở lại hộp chọn. Trình duyệt bảo vệ các tập hợp bàn phím và chuột thông thường, còn một số thiết bị chỉ cho phép trang web truy cập một phần báo cáo. Trình xem này nhận báo cáo đầu vào từ thiết bị được chọn và giữ dữ liệu trong thẻ hiện tại. Với các điều khiển tiêu chuẩn, hãy thử [Kiểm tra tay cầm chơi game](../gamepad-tester/) hoặc [Công cụ kiểm tra bàn phím](../keyboard-tester/).
