# Trình tính checksum CRC

Checksum CRC (Cyclic Redundancy Check) là các giá trị nhỏ gọn dùng để phát
hiện thay đổi dữ liệu ngoài ý muốn. Chúng phổ biến trong khung mạng, định dạng
lưu trữ, giao thức nhúng, bản cập nhật firmware và quy trình kiểm tra tính toàn
vẹn tệp, nơi một giá trị phát hiện lỗi nhanh hữu ích hơn chữ ký mật mã.

## Khi nào nên dùng

Dùng trình tính này khi bạn cần so sánh giá trị CRC từ tài liệu, giao thức phần
cứng, định dạng tệp hoặc hệ thống khác. Dán văn bản để kiểm tra nhanh, hoặc
nhập một tệp khi checksum cần được tính từ đúng luồng byte.

## Các biến thể được hỗ trợ

Công cụ tính các biến thể phổ biến từ công cụ CRC cũ của InBrowser.App: CRC-1,
CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT, CRC-16 Modbus,
CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2, CRCJAM và một số
mô hình CRC-64 bao gồm ECMA-182, GO-ISO, MS, NVME, REDIS, WE và XZ.

## Những điều cần lưu ý

Tên biến thể CRC rất quan trọng. Cùng một đầu vào có thể tạo ra các giá trị
khác nhau tùy theo đa thức, giá trị khởi tạo, thiết lập phản xạ và XOR cuối.
Nếu bạn đang khớp với một giao thức hoặc thông số của nhà cung cấp, hãy chọn
kết quả có tên biến thể khớp với thông số đó thay vì xem mọi độ rộng CRC là có
thể thay thế cho nhau.

CRC được thiết kế để phát hiện lỗi ngoài ý muốn, không dùng cho lưu trữ mật
khẩu, chữ ký hoặc bảo mật chống giả mạo. Với xác minh nhạy cảm về bảo mật, hãy
dùng hash mật mã hoặc quy trình chữ ký thay thế.
