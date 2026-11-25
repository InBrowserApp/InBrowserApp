## Tra cứu thỏa thuận lưu trữ Filecoin bằng Deal ID

Nhập **Deal ID** dạng số của một thỏa thuận trên thị trường lưu trữ của mạng chính Filecoin, rồi chọn **Tra cứu thỏa thuận**. Chọn **Thử ví dụ** để tải bản ghi công khai có thật và xem trạng thái, nhà cung cấp, khách hàng, các mốc thời gian và Piece CID. Công cụ này tra cứu các thỏa thuận trên thị trường lưu trữ (Storage Market). Filecoin Onchain Cloud dùng ID bộ dữ liệu riêng.

## Cách đọc trạng thái thỏa thuận Filecoin

Thỏa thuận đang hoạt động đã được ghi nhận kích hoạt và chưa đến thời điểm kết thúc dự kiến. Đang chờ kích hoạt nghĩa là thỏa thuận chưa được kích hoạt và vẫn có thể được kích hoạt đến hết epoch bắt đầu dự kiến. Công cụ cũng hiển thị trường hợp đã qua thời điểm bắt đầu mà chưa kích hoạt, thỏa thuận hết hạn hoặc trạng thái thị trường ghi nhận thỏa thuận bị phạt. Epoch bắt đầu và kết thúc lấy từ đề xuất thỏa thuận. Các ngày theo UTC được tính dựa trên lịch epoch của blockchain.

## So sánh Piece CID của thỏa thuận với tệp của bạn

Piece CID là giá trị cam kết được ghi nhận cho piece Filecoin. Sao chép mã này để đối chiếu với giá trị cam kết tính từ tệp trên thiết bị hoặc tệp CAR bằng Công cụ tính Piece CID Filecoin. Kết quả cũng hiển thị kích thước piece sau khi áp dụng quy tắc đệm của Filecoin. Thỏa thuận đã xác minh có cờ xác minh Filecoin Plus.

## Tìm thỏa thuận Filecoin cũ hơn

Trước tiên, trình duyệt truy vấn trạng thái thị trường hiện tại trên mạng chính Filecoin. Khi bản ghi không còn trong trạng thái này, công cụ có thể hiển thị các điều khoản ban đầu do Filfox lập chỉ mục và đánh dấu đó là bản ghi lịch sử. Các điều khoản này gồm những mốc thời gian dự kiến và các bên tham gia. Chọn **Xem trên Filfox** để mở cùng Deal ID trên trình khám phá.

Xem [tài liệu tham khảo RPC của thị trường lưu trữ Filecoin](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) để biết các trường mà blockchain trả về.
