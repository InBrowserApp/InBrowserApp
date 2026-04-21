## chmod là gì?

`chmod` ("change mode") là lệnh Unix/Linux dùng để thay đổi quyền của tệp và thư mục. Công cụ này cho phép bạn chuyển đổi giữa quyền dạng số như `755`, quyền dạng ký hiệu như `rwxr-xr-x`, và ma trận ô chọn mà không phải tự nhẩm tính.

## Quyền dạng số hoạt động như thế nào?

Mỗi chữ số đại diện cho một vai trò: chủ sở hữu, nhóm và những người khác. Trong mỗi chữ số, `4` nghĩa là đọc, `2` nghĩa là ghi, và `1` nghĩa là thực thi. Hãy cộng các giá trị đó để tạo quyền bạn muốn: `7 = rwx`, `6 = rw-`, `5 = r-x`, và `4 = r--`. Với thư mục, bit thực thi còn có nghĩa là bạn có thể đi vào thư mục đó.

## Các ví dụ chmod phổ biến

- `chmod 755 script.sh` cấp toàn quyền cho chủ sở hữu và cho phép những người khác đọc cũng như thực thi.
- `chmod 644 notes.txt` giữ cho tệp vẫn có thể được chủ sở hữu ghi, còn những người khác chỉ có thể đọc.
- `chmod 600 .env` là lựa chọn phổ biến cho dữ liệu bí mật riêng tư vì chỉ chủ sở hữu mới có thể đọc hoặc ghi.
- `chmod 775 shared-folder` hữu ích cho thư mục làm việc nhóm khi nhóm cũng cần tạo và sửa tệp.
