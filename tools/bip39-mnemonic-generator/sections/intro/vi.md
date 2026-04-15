Tạo seed phrase BIP39 trong trình duyệt, kiểm tra mnemonic đã nhập trước khi tin tưởng chúng, và chuyển đổi giữa entropy thô với các từ của ví mà không gửi dữ liệu nhạy cảm sang dịch vụ khác. Công cụ này hữu ích khi bạn cần một không gian làm việc duy nhất cho việc tạo, kiểm tra checksum và thao tác khôi phục ở mức thấp.

## Tạo có chủ đích

Chọn danh sách từ và số lượng từ được hỗ trợ, rồi tạo lại cho đến khi bạn có seed phrase muốn lưu. Entropy tương ứng được hiển thị bên cạnh cụm từ để bạn kiểm tra chính xác độ mạnh và giữ cả hai dạng biểu diễn khi ghi chép quy trình khôi phục.

## Xác thực trước khi nhập

Dùng chế độ xác thực khi ai đó đưa cho bạn một cụm từ ghi nhớ và bạn muốn kiểm tra nhanh checksum cùng số lượng từ trước khi nhập vào ví khác. Kết quả hợp lệ cũng hiển thị entropy đã khôi phục, rất hữu ích khi so sánh hai nguồn khôi phục hoặc gỡ lỗi các bước suy diễn.

## Chuyển đổi entropy cẩn thận

Chế độ chuyển đổi hoạt động theo cả hai hướng: từ entropy thô sang từ và từ các từ mnemonic quay lại entropy. Điều này khiến nó phù hợp cho dữ liệu kiểm thử, bản demo ví tất định và các đợt rà soát sự cố khi bạn cần xác nhận rằng một cụm từ vẫn ánh xạ tới đúng các byte mong đợi dưới một danh sách từ BIP39 cụ thể.
