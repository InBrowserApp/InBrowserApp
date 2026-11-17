## Giới thiệu về trình chuyển đổi phụ đề

Chuyển đổi các tệp phụ đề có sẵn giữa 19 định dạng văn bản có mốc thời gian hoặc xuất bản chép lời dạng văn bản thuần túy. Những tác vụ phổ biến gồm chuyển SRT sang VTT cho video trên web, chuyển lời thoại ASS hoặc SSA sang SRT, chuẩn bị phụ đề cho nền tảng video và gom nhiều tập đã chuyển đổi vào một tệp ZIP. Quá trình chuyển đổi diễn ra trong trình duyệt; các tệp phụ đề và nội dung đã dán không được tải lên.

Công cụ xử lý văn bản phụ đề và thời gian hiển thị. Chọn tệp hoặc dán phụ đề, chọn định dạng đầu ra rồi xem trước để kiểm tra kết quả trước khi tải xuống. Bạn có thể sửa nội dung đầu vào đã dán và chuyển đổi lại mà không làm thay đổi tệp gốc trên thiết bị.

## Cách chuyển đổi phụ đề

1. Chọn **Chọn tệp** để mở một hoặc nhiều tệp phụ đề, kéo tệp vào bảng đầu vào hoặc dán văn bản phụ đề vào trình chỉnh sửa. **Thử ví dụ** tải một mẫu SRT ngắn gồm hai đoạn phụ đề.
2. Giữ **Định dạng đầu vào** ở **Tự động nhận diện** khi sử dụng thông thường. Tính năng nhận diện kiểm tra nội dung thay vì chỉ dựa vào tên tệp. Tự chọn định dạng nguồn nếu tệp không thể được nhận diện rõ ràng.
3. Chọn **Định dạng đầu ra**. Với bản phụ đề cho trang web thông thường, chọn WebVTT; với trình phát hoặc trình chỉnh sửa yêu cầu tệp SRT, chọn SubRip.
4. Mở **Cài đặt chuyển đổi** khi cần đổi mã hóa tệp, tốc độ khung hình hoặc độ lệch thời gian. Thay đổi các cài đặt này trước khi chuyển đổi.
5. Chọn **Chuyển đổi phụ đề**. Kết quả cho biết định dạng nguồn và đầu ra, tên tệp đầu ra và số đoạn phụ đề đã chuyển đổi.
6. Chuyển giữa **Xem trước** và **Nội dung tệp**, sau đó sao chép văn bản đã chuyển đổi hoặc tải tệp xuống. Bảng hiển thị tối đa 100 đoạn phụ đề; nội dung tệp và tệp tải xuống bao gồm toàn bộ kết quả.

**Xóa** loại bỏ đầu vào và kết quả hiện tại khỏi trang. Chọn một nhóm tệp mới sẽ thay thế lựa chọn trước đó. Trình chuyển đổi không lưu lịch sử phụ đề, vì vậy hãy tải xuống các kết quả bạn muốn giữ lại.

## Các định dạng được hỗ trợ và độ chính xác đầu ra

Tất cả các mục bên dưới đều hỗ trợ đọc và ghi, ngoại trừ TXT là định dạng xuất bản chép lời dễ đọc. Mỗi định dạng lưu thời gian theo cách khác nhau; khi chọn định dạng có độ chính xác thấp hơn, các mốc thời gian được làm tròn theo đơn vị mà định dạng đó hỗ trợ.

| Định dạng                                | Phần mở rộng | Cách ghi thời gian                   |
| ---------------------------------------- | ------------ | ------------------------------------ |
| SubRip                                   | `.srt`       | Mili giây                            |
| WebVTT                                   | `.vtt`       | Mili giây                            |
| Advanced SubStation Alpha                | `.ass`       | Phần trăm giây                       |
| SubStation Alpha                         | `.ssa`       | Phần trăm giây                       |
| YouTube SubViewer                        | `.sbv`       | Mili giây                            |
| MicroDVD                                 | `.sub`       | Khung hình video                     |
| SubViewer 2.0                            | `.sub`       | Phần trăm giây                       |
| SAMI                                     | `.smi`       | Mili giây                            |
| LRC lyrics                               | `.lrc`       | Phần trăm giây cho thời gian bắt đầu |
| Timed Text                               | `.ttml`      | Mili giây                            |
| Distribution Format Exchange Profile     | `.dfxp`      | Mili giây                            |
| YouTube SRV3                             | `.srv3`      | Mili giây                            |
| YouTube transcript XML                   | `.xml`       | Giây với độ chính xác mili giây      |
| MPL2                                     | `.mpl`       | Phần mười giây                       |
| Spruce Subtitle, text format             | `.stl`       | Khung hình video                     |
| QuickTime Text                           | `.qt.txt`    | Mili giây                            |
| JSON                                     | `.json`      | Số mili giây                         |
| CSV                                      | `.csv`       | Số mili giây                         |
| TSV                                      | `.tsv`       | Số mili giây                         |
| Bản chép lời văn bản thuần túy, chỉ xuất | `.txt`       | Không có mốc thời gian               |

Đầu vào TTML cũng chấp nhận các tệp iTT tương thích. DFXP thuộc họ TTML. Khi xuất TTML, công cụ không tái tạo mọi cấu hình, bố cục hoặc quy tắc định dạng riêng của từng nền tảng.

Phần mở rộng `.sub` ở đây có thể là MicroDVD hoặc SubViewer dạng văn bản. VobSub nhị phân là một định dạng khác. Tương tự, định dạng `.stl` được hỗ trợ là Spruce STL dạng văn bản, khác với EBU STL nhị phân. Chọn định dạng theo tên đầy đủ khi các phần mở rộng này gây nhầm lẫn.

## Lựa chọn giữa SRT, VTT, ASS và văn bản thuần túy

**SRT** là lựa chọn hữu ích khi trình phát video, trình chỉnh sửa hoặc biểu mẫu tải lên yêu cầu phụ đề SubRip. **VTT** là định dạng dùng cho các bản phụ đề video HTML và cũng có thể chứa cài đặt đoạn phụ đề dành riêng cho web. Chuyển đổi giữa hai định dạng này giữ nguyên văn bản phụ đề và thời gian tính bằng mili giây, đồng thời tạo lại cú pháp tệp.

Một đoạn SRT được đánh số dùng dấu phẩy trước phần mili giây:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Cùng đoạn phụ đề đó ở dạng WebVTT có tiêu đề tệp và mốc thời gian dùng dấu chấm thập phân:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS và SSA** là những lựa chọn trao đổi hữu ích khi ứng dụng tiếp theo yêu cầu chúng. Định dạng đậm, nghiêng và gạch chân được hỗ trợ có thể được giữ lại giữa các định dạng có khả năng biểu diễn chúng. Phông chữ, vị trí trên màn hình, lệnh vẽ, hoạt ảnh karaoke và các tính năng trình bày nâng cao khác được đơn giản hóa; các sự kiện đồ họa ASS không có lời thoại dễ đọc sẽ bị bỏ qua. Trình chuyển đổi tập trung vào phụ đề dễ đọc thay vì tái tạo hoạt ảnh hoặc bố cục đã thiết kế.

**TXT** trích xuất lời thoại dễ đọc, không có mốc thời gian hoặc định dạng. Phần xem trước hiển thị văn bản đã xuất thay cho bảng thời gian. Xuất TXT không tự tạo thời gian phụ đề, chép lời từ giọng nói hoặc dịch ngôn ngữ lời thoại.

## Mã hóa tệp và văn bản dễ đọc

Giải mã tệp tự động sử dụng UTF-8 hoặc UTF-16 khi có dấu thứ tự byte để nhận diện. Với các tệp cũ, hãy chọn mã hóa gốc nếu ký tự hiển thị sai hoặc không thể giải mã tệp. Các lựa chọn gồm Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS và EUC-KR, cùng các tùy chọn UTF-8 và UTF-16 cụ thể.

Ví dụ, thử GB18030 cho phụ đề tiếng Trung mà bạn biết đã được lưu bằng mã hóa đó, hoặc Shift_JIS cho tệp tiếng Nhật từ một ứng dụng cũ. Mã hóa thay đổi cách đọc các byte hiện có; nó không dịch ý nghĩa của chúng. Chuyển đổi lại sau khi chọn mã hóa khác. Các tệp phụ đề tải xuống sử dụng UTF-8, bất kể mã hóa đầu vào.

## Điều chỉnh thời gian và tốc độ khung hình

### Dịch tất cả phụ đề sớm hơn hoặc muộn hơn

Độ lệch thời gian được tính bằng mili giây. Giá trị `1500` làm mọi đoạn phụ đề xuất hiện muộn hơn 1,5 giây; `-500` làm phụ đề xuất hiện sớm hơn nửa giây. Với một đoạn phụ đề bắt đầu tại `00:00:01.250`, các cài đặt đó lần lượt tạo ra `00:00:02.750` và `00:00:00.750`.

Độ lệch dịch chuyển cả thời gian bắt đầu lẫn kết thúc, giữ nguyên thời lượng cho đến khi chạm đầu dòng thời gian. Những đoạn phụ đề bị dịch hoàn toàn về trước mốc 0 sẽ bị xóa; đoạn có một phần nằm trước mốc 0 sẽ bắt đầu tại 0. Độ lệch sửa được độ trễ cố định. Nó không sửa được bản phụ đề có độ lệch thay đổi trong suốt video.

### Dùng tốc độ khung hình cho mốc thời gian dựa trên khung hình

MicroDVD và Spruce STL sử dụng khung hình video, nên tốc độ khung hình quyết định cách quy đổi khung hình thành thời gian đã trôi qua. TTML cũng có thể chứa thời gian dựa trên khung hình. Sử dụng tốc độ khung hình của video nguồn, chẳng hạn `23.976`, `24`, `25` hoặc `29.97`, khi cần để diễn giải đầu vào.

Tốc độ khung hình được nhúng trong đầu vào được ưu tiên khi định dạng cung cấp giá trị này. Với đầu ra dựa trên khung hình, cài đặt đã chọn quyết định tốc độ khung hình được ghi. Thay đổi cài đặt này không co giãn các mốc thời gian dạng đồng hồ thông thường của SRT hoặc VTT; nó thay đổi cách diễn giải hoặc ghi các mốc thời gian dựa trên khung hình.

### Hiểu cách làm tròn và xử lý thời gian kết thúc bị thiếu

SRT và VTT giữ độ chính xác mili giây. ASS, SSA, SubViewer và LRC làm tròn đến phần trăm giây; MPL2 làm tròn đến phần mười giây; đầu ra dựa trên khung hình làm tròn theo khung hình. Đoạn phụ đề rất ngắn vẫn giữ thời lượng dương sau khi làm tròn. Phần xem trước phản ánh thời gian của định dạng xuất, thay vì hiển thị mốc thời gian đầu vào chưa làm tròn.

LRC có thể cung cấp thời gian bắt đầu mà không có thời gian kết thúc. Thời gian kết thúc bị thiếu được lấy theo mốc bắt đầu khác tiếp theo, hoặc sau hai giây đối với đoạn cuối. Xuất LRC không thể giữ nguyên các khoảng trống và thời gian kết thúc chồng lấn ban đầu; phụ đề nhiều dòng trở thành các dòng lời bài hát đơn. QuickTime Text sử dụng các dấu mốc trên dòng thời gian; SAMI và QuickTime có thể tái tạo những đoạn phụ đề chồng lấn thành văn bản kết hợp tại mỗi ranh giới thời gian, nên kết quả có thể có số đoạn phụ đề khác với ban đầu.

## Chuyển đổi hàng loạt và tải xuống ZIP

Chọn hoặc thả nhiều tệp để chuyển đổi với cùng định dạng đầu ra và cài đặt. Chọn một kết quả từ menu tên tệp để kiểm tra. Các tệp không thể chuyển đổi sẽ hiển thị lỗi riêng, còn những kết quả thành công vẫn có thể được tải xuống riêng lẻ.

Khi ít nhất hai tệp được chuyển đổi thành công, **Tải tất cả dưới dạng ZIP** sẽ gom các đầu ra đó lại. Tệp nén chỉ chứa những kết quả chuyển đổi thành công. Xem lại các lỗi hiển thị, điều chỉnh định dạng đầu vào hoặc mã hóa cho phù hợp rồi chuyển đổi lại những tệp còn lại.

Tên tệp đầu ra giữ phần tên gốc và sử dụng phần mở rộng đã chọn: ví dụ, `episode01.srt` trở thành `episode01.vtt`. Nếu nhiều kết quả có cùng tên, hậu tố như ` (2)` giúp phân biệt các mục trong ZIP. ZIP ở đây là tùy chọn tải xuống; hãy chọn chính các tệp phụ đề làm đầu vào.

## Trao đổi dữ liệu bằng JSON, CSV và TSV

JSON sử dụng một mảng các đối tượng phụ đề với giá trị `start` và `end` tính bằng mili giây cùng một chuỗi `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Trình đọc cũng chấp nhận JSON kiểu Whisper chứa một mảng `segments`, trong đó các giá trị `start` và `end` của đoạn được tính bằng giây. Đây là quy ước đầu vào riêng; xuất JSON thông thường vẫn sử dụng mili giây.

CSV và TSV sử dụng tên cột `start`, `end` và `text`. Thời gian đầu vào có thể là số mili giây hoặc mốc thời gian dạng đồng hồ. CSV đặt các trường chứa dấu phẩy, dấu ngoặc kép hoặc ký tự xuống dòng trong dấu ngoặc kép; TSV dùng ký tự tab giữa các cột. Cả hai định dạng xuất đều ghi số mili giây. Dùng các định dạng này khi chuyển phụ đề vào bảng tính hoặc quy trình xử lý phụ đề khác.

## Câu hỏi thường gặp

### Vì sao phần xem trước và văn bản tải xuống trông khác nhau?

Bảng xem trước hiển thị văn bản phụ đề dễ đọc và thời gian của định dạng đích. Nội dung tệp hiển thị tệp đã tuần tự hóa thực tế, bao gồm tiêu đề, số thứ tự, dấu phân cách và cú pháp định dạng được hỗ trợ. Tệp tải xuống chứa toàn bộ nội dung đã tuần tự hóa đó, ngay cả khi bảng chỉ hiển thị 100 đoạn phụ đề đầu tiên.

### Vì sao kiểu hoặc vị trí thay đổi?

Các định dạng không có cùng mô hình định kiểu. Định dạng cơ bản được hỗ trợ được giữ lại ở nơi có thể biểu diễn; kiểu nâng cao, vị trí đoạn phụ đề trên web, hoạt ảnh và siêu dữ liệu nền tảng không được tái tạo đầy đủ. Dùng chế độ xem nội dung tệp để kiểm tra kết quả xuất rồi thử trong trình phát hoặc trình chỉnh sửa mà bạn sẽ sử dụng.

### Công cụ có thể trích xuất phụ đề từ video hoặc bản phụ đề hình ảnh không?

Hãy bắt đầu bằng một tệp phụ đề văn bản có sẵn. Trước tiên, trích xuất các bản phụ đề được nhúng trong video. Các bản PGS/SUP và VobSub/IDX dạng hình ảnh cần OCR để chuyển thành văn bản; EBU STL nhị phân cần trình chỉnh sửa phụ đề có thể đọc định dạng đó.

### Tôi có thể xem đặc tả định dạng ở đâu?

Xem [đặc tả WebVTT](https://www.w3.org/TR/webvtt1/), [đặc tả TTML](https://www.w3.org/TR/ttml2/) và [các định dạng phụ đề được YouTube hỗ trợ](https://support.google.com/youtube/answer/2734698) để biết cú pháp tệp và yêu cầu của nền tảng.
