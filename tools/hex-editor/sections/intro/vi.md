## Xem và chỉnh sửa tệp nhị phân trực tuyến

Mở hoặc thả một tệp trên thiết bị vào trình chỉnh sửa hex. Bạn cũng có thể chọn **Thử tệp mẫu** để xem cách các byte được hiển thị. Công cụ này giúp bạn kiểm tra phần đầu tệp, xác minh chữ ký định dạng như `89 50 4E 47` của tệp PNG, xem các byte không có ký tự in được hoặc thay giá trị đã biết tại một vị trí cụ thể.

## Đọc vị trí byte, giá trị hex và ký tự ASCII

Cột bên trái cho biết vị trí (offset) của byte đầu tiên trên mỗi dòng, đếm từ 0. Ở giữa, mỗi byte gồm hai chữ số thập lục phân, từ `00` đến `FF`. Cột ASCII hiển thị ký tự in được tương ứng với từng byte và dùng dấu chấm cho các giá trị còn lại. Chẳng hạn, dãy byte `48 65 6C 6C 6F` hiển thị thành `Hello`.

Nhập vị trí ở hệ thập lục phân như `1A` hoặc `0x1A` để đến thẳng byte ở vị trí 26. Dùng nút chuyển trang để xem các byte lân cận. Trình chỉnh sửa chỉ đọc từng trang, nên bạn có thể xem một phần nhỏ của tệp lớn.

## Ghi đè byte và lưu bản sao

Chọn một byte trong cột hex rồi nhập hai chữ số. Trình chỉnh sửa cập nhật ký tự ASCII tương ứng và chuyển sang byte kế tiếp. Dùng các phím mũi tên để di chuyển giữa các byte. Chọn **Hoàn tác** để lùi một thay đổi hoặc **Làm lại** để áp dụng lại thay đổi đó. Việc ghi đè giữ nguyên kích thước tệp và vị trí của các byte khác.

Chọn **Tải xuống bản sao** để lưu kết quả. Tệp gốc được giữ nguyên. Toàn bộ quá trình đọc và chỉnh sửa diễn ra trong trình duyệt của bạn.
