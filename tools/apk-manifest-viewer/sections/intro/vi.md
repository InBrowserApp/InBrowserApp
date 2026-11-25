## Mở APK và đọc tệp kê khai

Thả tệp `.apk` Android hoặc chọn **Mở APK hoặc tệp kê khai**. Trình xem mở `AndroidManifest.xml` trong gói APK, kể cả XML nhị phân đã biên dịch có trong hầu hết APK. Bạn cũng có thể mở tệp kê khai nhị phân hoặc văn bản đã trích xuất. Hãy thử APK mẫu để xem thông tin tổng quan và XML đã giải mã. Tệp được xử lý ngay trong trình duyệt.

## Hiểu các trường về gói, phiên bản và SDK

**Tên gói** dùng để nhận diện ứng dụng Android. Tên phiên bản là nhãn của bản phát hành hiển thị cho người dùng, còn mã phiên bản là số mà Android dùng để xác định thứ tự cập nhật. SDK tối thiểu là cấp API Android thấp nhất được khai báo trong tệp kê khai. SDK mục tiêu là cấp API mà ứng dụng hướng đến. Các trường không có trong tệp kê khai sẽ hiển thị là “Không chỉ định”.

## Kiểm tra quyền và xuất AndroidManifest.xml

Phần tổng quan liệt kê tên quyền mà gói đã khai báo. Android quyết định quyền thực sự được cấp trên thiết bị dựa trên phiên bản hệ điều hành, chế độ cài đặt của ứng dụng và lựa chọn của người dùng. Mở **XML của tệp kê khai** để đọc các thành phần, bộ lọc ý định và nội dung khai báo quyền có điều kiện. Chọn **Sao chép XML** hoặc **Tải XML về** để lưu nội dung đã giải mã. Tham chiếu đến tài nguyên đã biên dịch có thể xuất hiện dưới dạng mã nhận dạng như `@0x7f010001`.

[Cấu trúc và các phần tử của tệp kê khai Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
