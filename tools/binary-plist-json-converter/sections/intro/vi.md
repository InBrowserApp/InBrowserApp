## Chuyển tệp Plist nhị phân sang JSON

Chọn **Mở Plist nhị phân** hoặc thả tệp `.plist` nhị phân của Apple vào công cụ. Xem lại JSON đã được định dạng, rồi sao chép hoặc tải về dưới dạng tệp `.json`. Danh sách thuộc tính nhị phân bắt đầu bằng dấu nhận dạng `bplist00` và thường xuất hiện trong gói ứng dụng Apple, tùy chọn và dữ liệu lưu trữ. Hãy thử ví dụ để xem các giá trị trong danh sách thuộc tính được biểu diễn ra sao trong JSON.

## Chuyển JSON sang danh sách thuộc tính nhị phân của Apple

Chọn **JSON sang Plist**, dán JSON hoặc mở tệp `.json`, rồi chọn **Chuyển sang Plist nhị phân**. Sau đó, tải tệp `.plist` về. Chuỗi, giá trị boolean, số, mảng và đối tượng sẽ được chuyển sang kiểu dữ liệu tương ứng trong danh sách thuộc tính. Hãy thay `null` bằng giá trị khác hoặc bỏ khóa tương ứng. Tệp và văn bản đã dán được xử lý trong trình duyệt.

## Giữ nguyên ngày giờ, dữ liệu byte và số nguyên lớn

JSON không có kiểu dữ liệu riêng cho ngày giờ, dữ liệu byte hoặc UID của bản lưu trữ theo khóa. Công cụ dùng thẻ `$plist` để ghi rõ kiểu dữ liệu, giúp giữ nguyên ý nghĩa của các giá trị khi chuyển đổi theo cả hai chiều.

| Giá trị Plist                           | Ví dụ JSON                                             |
| --------------------------------------- | ------------------------------------------------------ |
| Ngày giờ theo UTC                       | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Dữ liệu byte ở dạng Base64              | `{"$plist":"data","value":"AQID"}`                     |
| Số nguyên lớn dưới dạng chuỗi thập phân | `{"$plist":"integer","value":"9007199254740993"}`      |
| UID của bản lưu trữ theo khóa           | `{"$plist":"uid","value":42}`                          |
| Số thực có độ lớn lớn                   | `{"$plist":"real","value":"1e+100"}`                   |

Giữ các thẻ này khi chuyển ngược sang Plist. Với số nguyên ngoài phạm vi an toàn của JSON, dùng thẻ số nguyên và đặt giá trị thập phân trong dấu ngoặc kép. Từ điển có cấu trúc trùng với thẻ sẽ được bọc bằng thẻ `dictionary` để giữ nguyên các khóa. Quá trình chuyển đổi giữ nguyên cấu trúc và các giá trị được hỗ trợ. Thứ tự đối tượng Plist, kiểu số của các số thực có giá trị nguyên như `1.0` và dữ liệu nhị phân ban đầu có thể thay đổi.

[Cấu trúc và kiểu dữ liệu của danh sách thuộc tính Apple](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)
