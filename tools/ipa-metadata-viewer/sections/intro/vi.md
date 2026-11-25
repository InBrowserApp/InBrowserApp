## Mở IPA và đọc siêu dữ liệu của ứng dụng chính

Thả tệp `.ipa` của iOS hoặc chọn **Mở tệp IPA**. Trình xem đọc danh sách thuộc tính của ứng dụng chính tại đường dẫn như `Payload/Trail Notes.app/Info.plist`. Hãy thử tệp IPA mẫu để xem các trường trước khi mở tệp của mình. Việc giải nén tệp và phân tích danh sách thuộc tính diễn ra ngay trong trình duyệt.

## Hiểu mã định danh gói, phiên bản và nền tảng

Mã định danh gói được lưu trong `CFBundleIdentifier` và dùng để nhận diện gói ứng dụng. `CFBundleShortVersionString` lưu phiên bản phát hành, còn `CFBundleVersion` xác định bản dựng. Dùng `MinimumOSVersion` và `CFBundleSupportedPlatforms` để kiểm tra phiên bản hệ điều hành tối thiểu và tên các nền tảng được ghi trong gói. Tên hiển thị được lấy từ `CFBundleDisplayName` hoặc `CFBundleName`.

## Kiểm tra và xuất Info.plist

Chọn **Info.plist** để xem danh sách thuộc tính đầy đủ ở dạng XML dễ đọc, kể cả những khóa không hiện trong phần tổng quan. Trình xem đọc được danh sách thuộc tính dạng nhị phân và XML. Chọn **Sao chép XML** để dùng bản dễ đọc trong công cụ khác, hoặc **Tải Info.plist về** để lưu tệp gốc. Đường dẫn hiển thị cho biết gói ứng dụng nào chứa siêu dữ liệu này.

[Tài liệu tham khảo của Apple về danh sách thuộc tính thông tin](https://developer.apple.com/documentation/bundleresources/information-property-list)
