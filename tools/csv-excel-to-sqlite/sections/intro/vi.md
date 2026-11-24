## Chuyển bảng tính thành cơ sở dữ liệu SQLite

Thêm một hoặc nhiều tệp CSV hoặc Excel (.xlsx hoặc .xls). Mỗi tệp CSV và mỗi trang tính Excel có dữ liệu sẽ trở thành một bảng riêng trong cùng một cơ sở dữ liệu. Xem trước để kiểm tra các cột và đổi tên bảng nếu cần, rồi chọn **Tạo cơ sở dữ liệu SQLite**. Quá trình chuyển đổi diễn ra trong trình duyệt và tệp của bạn vẫn nằm trên thiết bị.

## Cách nhập hàng và cột vào SQLite

Theo mặc định, hàng đầu tiên được dùng làm tên cột. Tắt **Dùng hàng đầu tiên làm tên cột** cho một bảng để giữ hàng đó trong dữ liệu. Công cụ sẽ tự tạo tên cột như `column_1`. Tên bảng hoặc tên cột trùng nhau được thêm số ở cuối, vì vậy thêm một tệp trùng tên vẫn giữ được cả hai bảng.

Trình chuyển đổi tự nhận diện cột chứa số, đồng thời giữ nguyên số 0 ở đầu mã định danh dạng văn bản như `00123`. Ô trống trở thành giá trị SQL `NULL`. Ngày tháng trong Excel được lưu dưới dạng chuỗi ngày hoặc dấu thời gian theo chuẩn ISO. Các ô có công thức dùng kết quả đã lưu trong sổ làm việc. Nếu cần cập nhật kết quả, hãy tính lại công thức và lưu tệp trong Excel trước khi chuyển đổi.

## Truy vấn kết quả bằng SQL

Chọn **Mở trong Trình xem SQLite** để duyệt bảng và chạy truy vấn. Bạn cũng có thể tải cơ sở dữ liệu `.sqlite` xuống để dùng với công cụ dòng lệnh SQLite, Python hoặc ứng dụng SQLite khác. Ví dụ, chuyển đổi `orders.csv` và một tệp Excel có trang tính tên `customers`, rồi dùng truy vấn sau để đếm số đơn hàng của mỗi khách hàng.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Khi áp dụng ví dụ cho dữ liệu của mình, hãy dùng tên bảng và tên cột trong bản xem trước.
