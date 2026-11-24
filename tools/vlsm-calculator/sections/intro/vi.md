## Cách chia mạng con IPv4 theo VLSM

Nhập khối mạng gốc theo ký hiệu CIDR, chẳng hạn 192.168.10.0/24. Thêm một dòng cho mỗi mạng con và nhập số địa chỉ cần dùng, tính cả địa chỉ cho cổng mặc định và phần dự phòng để mở rộng nếu cần. Sau khi tính, bạn có thể xem từng khối mạng đã cấp phát, mặt nạ mạng con, dải địa chỉ khả dụng, địa chỉ quảng bá và các khối CIDR còn trống để dùng sau này.

Mặt nạ mạng con có độ dài thay đổi (VLSM) cho phép chia một mạng thành các mạng con có kích thước khác nhau. Công cụ chọn khối nhỏ nhất đáp ứng từng nhu cầu và xếp các khối từ lớn đến nhỏ, sao cho địa chỉ đầu mỗi khối đúng ranh giới CIDR. Mạng con thông thường dành riêng địa chỉ mạng và địa chỉ quảng bá. Chẳng hạn, mạng /26 có 62 địa chỉ khả dụng, đủ cho 50 máy.

Chỉ chọn /31 cho kết nối IPv4 điểm-điểm hỗ trợ sử dụng cả hai địa chỉ. Chọn /32 nếu chỉ cần một địa chỉ, ví dụ cho giao diện loopback của bộ định tuyến. Hai tùy chọn này đều không có địa chỉ quảng bá. Mọi phép tính được thực hiện trong trình duyệt, tên mạng con cũng được giữ tại đó.
