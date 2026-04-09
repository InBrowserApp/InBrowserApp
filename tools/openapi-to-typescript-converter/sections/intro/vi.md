## OpenAPI To TypeScript Converter là gì?

OpenAPI to TypeScript Converter chuyển tài liệu OpenAPI 3.x thành kiểu TypeScript được tạo ra ngay trong trình duyệt. Công cụ này hữu ích khi bạn muốn xem nhanh kiểu sinh ra, tải về tệp khai báo, hoặc thử an toàn các tùy chọn `openapi-typescript` mà không cần gửi schema lên máy chủ.

## Khi nào nên dùng

Dùng công cụ này khi bạn đã có schema OpenAPI ở JSON hoặc YAML và muốn có model request và response có kiểu cho ứng dụng frontend, bản thử SDK, hoặc rà soát API. Nó đặc biệt hữu ích khi so sánh các tùy chọn tạo trước khi bạn đưa kết quả vào kho mã nguồn.

## Trước khi tạo

Bản chuyển sang trình duyệt này hỗ trợ tài liệu OpenAPI 3.0 và 3.1 đã được bundle. Nếu schema của bạn vẫn còn các đích `$ref` bên ngoài, hãy bundle hoặc inline chúng trước, rồi tạo đầu ra TypeScript cuối cùng tại đây.
