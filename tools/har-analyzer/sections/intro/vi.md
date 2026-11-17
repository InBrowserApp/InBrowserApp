## Mở bản ghi HAR

Xuất tệp HAR (HTTP Archive) từ bảng Network của trình duyệt sau khi ghi lại các yêu cầu cần kiểm tra. Mở hoặc thả tệp `.har` hay `.json` vào đây, hoặc tải ví dụ. Giới hạn tệp là 20 MiB và 20,000 mục.

## Tìm yêu cầu chậm hoặc không thành công

Tìm theo URL, phương thức, trạng thái hoặc loại MIME, rồi sắp xếp theo thời điểm bắt đầu, thời lượng hoặc dung lượng truyền. Các yêu cầu dùng chung một thang thời gian, tính từ yêu cầu sớm nhất. Chọn một yêu cầu để kiểm tra tiêu đề HTTP, cookie, tham số, nội dung và các giai đoạn thời gian.

Bộ lọc thất bại bao gồm trạng thái 0, 4xx và 5xx. Trạng thái 0 nghĩa là không có phản hồi HTTP nào được ghi lại; bộ lọc 3xx bao gồm phản hồi bộ nhớ đệm 304. TLS nằm trong thời gian kết nối.

## Đọc dữ liệu đã ghi lại

Việc xử lý diễn ra trong trình duyệt của bạn. Các chi tiết có sẵn phụ thuộc vào bản xuất. Dung lượng không xác định bị loại khỏi số liệu tổng hợp; không thể tính khoảng thời gian bản ghi khi thiếu thời lượng của một yêu cầu. Biểu đồ thác nước vẫn dùng thời điểm bắt đầu được ghi lại và thời điểm kết thúc đã biết.

Bản xem trước nội dung giữ nguyên văn bản đã ghi lại. Bản xem trước và bản sao của chúng, cùng các giá trị trường riêng lẻ, đều được giới hạn ở 100,000 ký tự. Nội dung đã mã hóa vẫn giữ nguyên dạng mã hóa.
