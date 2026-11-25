## Ước tính chi phí lưu trữ Filecoin Onchain Cloud

Nhập dung lượng dữ liệu, **Thời gian lưu (ngày)** và **Số bản sao**. Công cụ tính chi phí lưu trữ một bộ dữ liệu mới cho mỗi bản sao bằng Filecoin Warm Storage Service. Kết quả gồm đơn giá hằng tháng cho lưu trữ và tạo bằng chứng, chi phí cho kỳ đã chọn và phí tạo bộ dữ liệu, thêm các piece. Tất cả số tiền đều tính bằng USDFC. Filecoin quy ước một tháng tính phí là 30 ngày.

## Cách tính chi phí lưu trữ ước tính

Mỗi bộ dữ liệu đang hoạt động chịu phí lưu trữ theo dung lượng và một khoản phí cố định cho bằng chứng lưu giữ dữ liệu (Proof of Data Possession, PDP). Ví dụ, với đơn giá lưu trữ 2,50 USDFC trên mỗi TiB và phí tạo bằng chứng 0,12 USDFC trên mỗi bản sao, lưu một TiB thành hai bản sao tốn khoảng 5,24 USDFC mỗi 30 ngày. Ước tính dựa trên dung lượng bạn nhập. Filecoin tính dung lượng lập hóa đơn chính xác từ các nút lá chứa dữ liệu, nên có thể tính thêm tới 31 byte trên mỗi piece.

## Dự tính phí tải lên và khoản dự phòng có thể hoàn lại

Mở **Chi tiết tải lên** để nhập số piece và số lô tải lên cho mỗi bản sao. Ước tính mặc định dùng một lô trên mỗi bản sao. Để trống số piece để ước tính số lượng tối thiểu theo giới hạn tải lên 63,5 GiB của Synapse SDK, hoặc nhập số lượng thực tế. Mỗi bản sao có phí tạo bộ dữ liệu riêng. Khi thêm các piece, dịch vụ tính phí cơ bản trên mỗi lô và phí trên mỗi piece. Khoản dự phòng cho vòng đời dữ liệu là số dư dịch vụ giữ để thanh toán các hoạt động. Khoản dự phòng được hiển thị riêng với chi phí ước tính. Số tiền chưa dùng được giải phóng sau khi quyết toán. Ước tính áp dụng cho lần tải lên mới và thời gian lưu trữ tương ứng. Truy xuất dữ liệu và các hoạt động sau đó có mức phí riêng. Xem [giới hạn dung lượng của Synapse SDK](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints).

## Đơn giá Filecoin lấy từ đâu?

Trang dùng đơn giá tham khảo có ghi ngày hiển thị bên cạnh kết quả. Chọn **Cập nhật đơn giá từ mạng chính** để đọc hợp đồng định giá Warm Storage qua một RPC Filecoin công khai. Trình duyệt dùng đơn giá nhận được và hiển thị khối chứa dữ liệu đó. Bạn vẫn có thể tính với đơn giá tham khảo khi không thực hiện được yêu cầu này.

Xem [hướng dẫn chi phí lưu trữ Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) để biết cách tính dung lượng lập hóa đơn, số tiền cần nạp theo tài khoản và biểu phí đầy đủ.
