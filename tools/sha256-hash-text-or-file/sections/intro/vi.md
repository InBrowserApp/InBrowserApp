## Tính tổng kiểm tra SHA-256 cho văn bản hoặc tệp

Dán văn bản UTF-8 hoặc chọn **Nhập từ tệp** để băm các byte gốc của tệp. Sao chép kết quả ở dạng thập lục phân để đối chiếu với tổng kiểm tra đã công bố. SHA-256 tạo mã băm 256 bit, tương ứng với 64 ký tự thập lục phân.

Để kiểm tra tệp tải xuống, hãy băm tệp đó và so sánh toàn bộ giá trị thập lục phân với giá trị do nguồn cung cấp. Với văn bản, khoảng trắng, chữ hoa chữ thường và ký tự xuống dòng đều làm thay đổi mã băm. Bạn có thể thử với văn bản `abc` không có ký tự xuống dòng ở cuối để nhận kết quả sau.

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```
