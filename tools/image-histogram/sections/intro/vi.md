## Cách xem histogram của ảnh

Chọn hoặc kéo thả ảnh chụp, ảnh màn hình hay hình minh họa để xem histogram bên cạnh ảnh. Bạn cũng có thể thử với ảnh mẫu. Bắt đầu ở chế độ **Độ sáng** để xem sự phân bố tông màu tổng thể, rồi chuyển sang **RGB** để so sánh các kênh đỏ, lục và lam trên cùng một thang đo. Chọn từng kênh để kiểm tra kỹ hơn.

## Cách đọc vùng tối, vùng trung gian và vùng sáng

Trục ngang chạy từ 0 (tối nhất) đến 255 (sáng nhất). Vùng tối nằm bên trái, vùng trung gian ở giữa và vùng sáng ở bên phải. Cột càng cao thì càng có nhiều pixel ở mức đó. Di chuột qua hoặc chạm vào biểu đồ, hoặc dùng các phím mũi tên trên thanh trượt **Mức**, để xem số pixel chính xác.

Đỉnh nhọn ở một trong hai đầu biểu đồ có thể cho thấy vùng tối hoặc vùng sáng đã bị cắt và mất chi tiết. Ví dụ, một đỉnh ở mức 255 trên kênh đỏ có thể cho thấy kênh này bị cắt, dù histogram độ sáng vẫn còn khoảng trống bên phải. Nền trắng tinh cũng có thể tạo ra đỉnh ở mép biểu đồ, vì vậy hãy đối chiếu với bản xem trước ảnh. Hai mục **Vùng tối** và **Vùng sáng** lần lượt cho biết tỷ lệ pixel ở đúng mức 0 và 255 trong số pixel đã phân tích.

## Khi nào nên dùng thang logarit

Dùng **Tuyến tính** để so sánh chiều cao các cột theo tỷ lệ trực tiếp với số pixel. Dùng **Logarit** khi một mảng màu lớn khiến phần còn lại của histogram khó đọc. Thao tác này thay đổi chiều cao hiển thị của từng cột và giữ nguyên số pixel tương ứng.

## Công cụ đo những gì

Công cụ đếm pixel trên ảnh 8 bit do trình duyệt kết xuất, theo kích thước gốc. Độ sáng là tổng có trọng số của ba kênh đỏ, lục và lam, trong đó kênh lục có trọng số lớn nhất. Công cụ bỏ qua pixel hoàn toàn trong suốt và đếm mỗi pixel trong suốt một phần đúng một lần, dù giá trị RGB của pixel có thể được làm tròn khi kết xuất. Với ảnh động, công cụ phân tích một khung hình tĩnh. Ảnh được xử lý trên thiết bị của bạn.
