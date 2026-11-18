## Cách kiểm tra bàn phím

Chọn **Bắt đầu kiểm tra**, rồi lần lượt nhấn và thả từng phím trên bàn phím vật lý. Phím trên sơ đồ sẽ sáng khi bạn giữ và còn một chấm nhỏ sau khi thả. Hãy thử các phím Ctrl, Shift và Alt ở cả hai bên, rồi kiểm tra riêng cụm phím số nếu bàn phím có cụm này. Chọn **Đặt lại** để xóa dấu trên các phím đã thử và kiểm tra lại.

## Kiểm tra tổ hợp phím, rollover và ghosting

Thử một tổ hợp bạn hay dùng trong trò chơi hoặc ứng dụng. Ví dụ, giữ đồng thời `W`, `A`, `Shift` và `Space`. **Tổ hợp hiện tại** sẽ hiển thị cả bốn phím nếu trình duyệt nhận đủ. **Nhiều nhất cùng lúc** giữ lại số phím đồng thời cao nhất mà trình duyệt ghi nhận trong lần kiểm tra này, kể cả phím bổ trợ.

Rollover là khả năng ghi nhận nhiều phím cùng lúc. Nếu một phím hoạt động khi nhấn riêng nhưng bị mất trong một tổ hợp cụ thể, bàn phím có thể đã chặn tín hiệu của phím đó. Nếu một phím xuất hiện dù bạn không nhấn, đó có thể là hiện tượng phím ảo (ghosting). Hãy thử đúng tổ hợp đang gặp vấn đề, vì mỗi nhóm phím có thể cho kết quả khác nhau. [Bản minh họa ghosting trên bàn phím của Microsoft](https://www.microsoft.com/applied-sciences/projects/anti-ghosting-demo)

## Vì sao trình duyệt không nhận một phím?

Nếu đã bấm ra ngoài hoặc dùng Tab hay Esc để rời vùng kiểm tra, hãy chọn lại **Bắt đầu kiểm tra**. Một số phím như Fn và một số phím đa phương tiện do bàn phím hoặc hệ điều hành xử lý. Trình duyệt cũng có thể xử lý một phím tắt trước khi tín hiệu đến trang này. Nếu một phím chữ vẫn không hoạt động khi nhấn riêng, hãy thử trong ứng dụng khác để xem lỗi có lặp lại không.

## Vì sao một phím khác lại sáng?

Sơ đồ dùng vị trí vật lý của bàn phím ANSI cỡ đầy đủ. Với bố cục AZERTY tiếng Pháp, nhấn `A` có thể làm sáng phím `Q` trên sơ đồ. **Phím vừa nhấn** vẫn hiển thị giá trị theo bố cục đang dùng, `a`, bên cạnh mã vị trí vật lý `KeyQ`. Nếu dùng bàn phím nhỏ gọn, hãy kiểm tra những phím mà bàn phím của bạn có. [Hướng dẫn về mã vị trí phím của MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
