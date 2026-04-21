## Trình tạo robots.txt là gì?

Trình tạo robots.txt giúp kết hợp các quy tắc user-agent, đường dẫn allow/disallow và liên kết sitemap để tạo tệp robots.txt. Hãy đặt tệp ở thư mục gốc của trang dưới dạng /robots.txt để trình thu thập có thể đọc.

### Công cụ này giúp bạn làm gì

- Tạo các quy tắc riêng cho công cụ tìm kiếm, trình thu thập AI hoặc bot tùy chỉnh
- Thêm `Allow`, `Disallow`, sitemap và các chỉ thị nâng cao tùy chọn ở cùng một nơi
- Sao chép hoặc tải xuống tệp `robots.txt` sẵn sàng để xuất bản

### Ví dụ

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Ví dụ này yêu cầu trình thu thập tránh phần lớn `/admin/`, vẫn cho phép thu thập `/admin/help/` và chỉ ra vị trí sitemap.

### Lưu ý quan trọng

- Xuất bản tệp tại `/robots.txt` ở thư mục gốc của trang web
- `robots.txt` là công khai và chỉ mang tính hướng dẫn, không phải kiểm soát truy cập
- Không phải mọi trình thu thập đều hỗ trợ `Host` và `Crawl-delay`
