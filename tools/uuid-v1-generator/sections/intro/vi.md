Tạo mã định danh UUID v1 cục bộ trong trình duyệt khi bạn cần các giá trị bao gồm thời điểm tạo và mã định danh node. Công cụ này hữu ích cho các tích hợp cũ, nhập dữ liệu vào cơ sở dữ liệu, fixture có thứ tự, và các hệ thống vẫn yêu cầu UUID phiên bản 1 theo RFC 4122.

## Khi UUID v1 Hữu Ích

UUID v1 lưu timestamp, clock sequence, và giá trị node 48-bit trong chuỗi UUID tiêu chuẩn dài 36 ký tự. Nhờ đó, các ID được tạo có thể sắp xếp tương đối theo thời điểm tạo trong khi vẫn phù hợp với các hệ thống chấp nhận cột UUID thông thường, URL, log, và payload API.

## Quyền Riêng Tư Và Mã Định Danh Node

Cách tạo UUID v1 cổ điển dùng địa chỉ MAC thật của card mạng, điều này có thể làm lộ thông tin phần cứng. Công cụ này bắt đầu bằng một địa chỉ MAC ngẫu nhiên được quản trị cục bộ. Bạn có thể nhập một giá trị node cụ thể khi cần khớp với hệ thống cũ, nhưng nên tránh dùng địa chỉ phần cứng thật trong mẫu công khai hoặc dữ liệu được chia sẻ.

## Clock Sequence Và Tạo Batch

Clock sequence là giá trị 14-bit giúp tránh trùng lặp khi cùng một node tạo ID quanh cùng một thời điểm. Tạo batch giữ tất cả ID trong cùng một mili giây và tăng tick 100 nano giây cho từng dòng, nên mọi giá trị trong kết quả vẫn khác nhau.
