## IBAN là gì?

IBAN (International Bank Account Number) là mã nhận dạng tiêu chuẩn cho tài khoản ngân hàng dùng trong thanh toán quốc tế.

### Cấu trúc IBAN

IBAN bắt đầu bằng mã quốc gia 2 chữ, 2 số kiểm tra và BBAN theo từng quốc gia.

### Xác thực checksum

Tính hợp lệ của IBAN được kiểm tra bằng thuật toán mod-97 của ISO 13616.

1. Xóa khoảng trắng và chuyển bốn ký tự đầu xuống cuối
2. Chuyển chữ thành số (A=10, B=11, ..., Z=35)
3. Tính mod 97; IBAN hợp lệ cho số dư 1

Mỗi quốc gia quy định độ dài và cấu trúc cố định cho phần BBAN.
