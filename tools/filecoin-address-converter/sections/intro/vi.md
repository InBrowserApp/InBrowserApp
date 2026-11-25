## Chuyển đổi địa chỉ Filecoin f410 sang 0x

Dán địa chỉ `f410` hoặc `t410` rồi chọn **Chuyển đổi địa chỉ**. Công cụ xác minh tổng kiểm tra Filecoin và hiển thị địa chỉ `0x` kiểu Ethereum tương ứng với tổng kiểm tra EIP-55. Sao chép kết quả để dùng trong ví hoặc trình khám phá blockchain hỗ trợ địa chỉ kiểu Ethereum trên Filecoin. Chọn **Thử ví dụ** để xem cách chuyển đổi mà không cần nhập địa chỉ của bạn.

## Chuyển đổi địa chỉ 0x sang Filecoin

Dán địa chỉ `0x` có 40 ký tự thập lục phân. Chọn **Mạng chính** để nhận địa chỉ `f410` hoặc **Mạng thử nghiệm** để nhận địa chỉ `t410`. Calibration dùng chung tiền tố `t410` với các mạng thử nghiệm Filecoin khác. Dạng `0x` không chứa tiền tố mạng, nên có thể dùng một trong hai tiền tố Filecoin để biểu diễn cùng một dãy byte. Chọn mạng mà ví, trình khám phá blockchain hoặc sàn giao dịch của bạn sử dụng. Công cụ chấp nhận đầu vào thập lục phân toàn chữ thường hoặc toàn chữ hoa. Đầu vào có cả chữ hoa lẫn chữ thường phải có tổng kiểm tra EIP-55 hợp lệ.

## f410 và t410 có ý nghĩa gì?

Đây là các địa chỉ ủy quyền dùng trong Máy ảo Ethereum của Filecoin (FEVM). Địa chỉ `f410` hoặc `t410` và dạng `0x` tương ứng biểu diễn cùng một địa chỉ 20 byte trên mạng Filecoin đã chọn. Định dạng gốc của Filecoin dùng Base32 và tổng kiểm tra riêng. Việc đổi định dạng giữ nguyên các byte đó và không chuyển FIL giữa các mạng.

## Có thể chuyển đổi địa chỉ f0, f1, f2 hoặc f3 không?

Công cụ này chuyển đổi địa chỉ ủy quyền FEVM trong không gian tên `10`, nhận biết bằng tiền tố `f410` hoặc `t410`. Địa chỉ ID actor, dạng biểu diễn có mặt nạ `0xff0000…` và các loại địa chỉ Filecoin khác nằm ngoài phạm vi này. Việc ánh xạ một số loại địa chỉ gốc sang actor cần truy cập trạng thái blockchain. Phép chuyển đổi ở đây diễn ra ngay trong trình duyệt, không cần gọi RPC hay kết nối ví.

Xem [hướng dẫn về các loại địa chỉ và chuyển FIL của Filecoin](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) và [đặc tả tổng kiểm tra EIP-55](https://eips.ethereum.org/EIPS/eip-55).
