## Tra cứu siêu dữ liệu NFT bằng địa chỉ hợp đồng và ID token

Dán **Địa chỉ hợp đồng** trên mạng chính Ethereum, nhập **ID token**, rồi chọn **Xem siêu dữ liệu**. ID token có thể là số thập phân như `1` hoặc số thập lục phân như `0x1`. Chọn **Thử ví dụ** để xem toàn bộ quy trình tra cứu. Công cụ gửi yêu cầu RPC chỉ đọc tới Ethereum ngay trong trình duyệt để bạn có thể tra cứu token công khai mà không cần kết nối ví.

## Tìm URI token, ảnh, đặc điểm và JSON

Công cụ đọc `tokenURI` với ERC-721 hoặc `uri` với ERC-1155. **URI token** là chuỗi do hợp đồng trả về. Công cụ đọc siêu dữ liệu tại URI này rồi hiển thị ảnh, tên và đặc điểm nếu có. Dùng **JSON gốc** để xem hoặc sao chép phản hồi nguyên bản. Công cụ hỗ trợ IPFS, HTTP, Arweave và URI dữ liệu chứa JSON nội tuyến.

## Cách thay thế ID token ERC-1155

Hợp đồng ERC-1155 có thể trả về một mẫu dùng chung cho nhiều token. Công cụ thay `{id}` bằng ID token ở dạng thập lục phân viết thường, thêm số 0 ở đầu cho đủ 64 ký tự và bỏ tiền tố `0x`. Khi mẫu được thay thế, **URI sau khi phân giải** hiển thị địa chỉ dùng để truy xuất token đó. Công cụ áp dụng cùng cách thay thế cho các trường xem trước như liên kết ảnh.

## Nếu có URI token nhưng không có ảnh thì sao?

Hợp đồng có thể trả về URI ngay cả khi máy chủ web hoặc cổng truy cập IPFS tạm thời không hoạt động. Nếu không tải được siêu dữ liệu, bạn vẫn có thể sao chép URI. Nếu có JSON, hãy kiểm tra trường `image` rồi mở trực tiếp nguồn ảnh. Máy chủ HTTP cũng có thể hạn chế yêu cầu khác nguồn, ảnh hưởng đến dữ liệu mà trình duyệt đọc được.

Xem các trường thường dùng trong ứng dụng NFT tại [tiêu chuẩn ERC-721](https://eips.ethereum.org/EIPS/eip-721), [đặc tả siêu dữ liệu ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) và [hướng dẫn siêu dữ liệu OpenSea](https://docs.opensea.io/docs/metadata-standards).
