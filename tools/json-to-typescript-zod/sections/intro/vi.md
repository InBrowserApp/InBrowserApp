## Cách công cụ suy luận các trường

Công cụ xem xét từng phần tử trong mảng. Trong ví dụ này, chỉ bản ghi đầu tiên có trường `active`, nên trường này không bắt buộc. Cả hai bản ghi đều có trường `name`, một bản ghi chứa chuỗi và bản ghi kia chứa `null`. Vì vậy, đây là trường bắt buộc có kiểu `string | null`.

```json
[
  { "id": 1, "name": "Ada", "active": true },
  { "id": 2, "name": null }
]
```

```ts
export type ApiResponse = Array<{
  id: number
  name: string | null
  active?: boolean
}>
```

Nếu mảng mẫu rỗng, kiểu phần tử là `unknown`. Hãy đưa vào mẫu các bản ghi có cấu trúc khác nhau mà API của bạn trả về để kết quả phản ánh dữ liệu thực tế sát hơn.

## Khi nào nên dùng TypeScript hoặc Zod?

Dùng **TypeScript** để kiểm tra kiểu trong trình soạn thảo mã và khi biên dịch. Dùng **Zod** để kiểm tra dữ liệu đầu vào khi chương trình chạy bằng `apiResponseSchema.safeParse(data)`. Tệp Zod được tạo cũng xuất kiểu TypeScript. Khi đặc tả API có yêu cầu cụ thể, hãy bổ sung các quy tắc như giá trị được phép hoặc định dạng chuỗi.
