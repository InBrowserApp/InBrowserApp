Tạo KSUID ngay trong trình duyệt mà không gửi lô hiện tại sang dịch vụ khác. Công cụ này phù hợp khi bạn cần các mã định danh vẫn duy nhất trong hệ thống phân tán, đồng thời có thể sắp xếp gần đúng theo thời điểm tạo cho log, feed, dữ liệu import hoặc các bản ghi có thứ tự.

## Vì Sao Nên Dùng KSUID

KSUID kết hợp một dấu thời gian 32 bit với 128 bit dữ liệu ngẫu nhiên, rồi mã hóa kết quả thành chuỗi Base62 dài 27 ký tự. Nhờ vậy mỗi ID vẫn gọn, thân thiện với URL và dễ lưu trữ, còn dấu thời gian được nhúng vào giúp các giá trị mới hơn thường nằm sau các giá trị cũ hơn.

## Chọn Thời Gian Hiện Tại Hoặc Tùy Chỉnh

Hãy dùng thời gian hiện tại khi bạn cần ID mới cho dữ liệu production, bản demo hoặc các đợt tạo hàng loạt thông thường. Hãy chuyển sang dấu thời gian tùy chỉnh khi bạn cần fixture có thể tái tạo, bản ghi backfill, mẫu migration hoặc test case cần trông như được tạo ở một thời điểm cụ thể.

## Điều Cần Biết Trước Khi Xuất

KSUID chỉ giữ độ chính xác đến giây, vì vậy mọi đầu vào có mili giây sẽ bị làm tròn xuống đầu của giây đó. Các ID được tạo trong cùng một giây vẫn là duy nhất, nhưng thứ tự cuối cùng của chúng cũng chịu ảnh hưởng từ phần ngẫu nhiên. Vì vậy hãy coi KSUID là ID có thể sắp theo thời gian, chứ không phải chuỗi tăng dần tuyệt đối.
