## Xem các tần số trong một tệp âm thanh

Dùng công cụ phân tích phổ âm thanh để tìm tiếng ù trầm, so sánh các thành phần tần số hoặc xem bản ghi bị mất dải tần cao ở đâu. Biểu đồ hiển thị tần số theo hertz (Hz) và mức tín hiệu theo decibel so với mức tối đa của thang kỹ thuật số (dBFS). Các đỉnh cho biết dải tần nào có nhiều năng lượng nhất trong bản ghi.

## Cách xem phổ âm thanh

1. Chọn hoặc kéo thả tệp mono hay stereo ở định dạng WAV, MP3, M4A, FLAC hoặc OGG. Khả năng giải mã tùy thuộc vào trình duyệt.
2. Tìm tần số trội, sau đó trỏ hoặc chạm vào biểu đồ để đọc một tần số khác và mức tín hiệu tương ứng. Bạn có thể dùng bàn phím để di chuyển thanh trượt và đọc cùng các giá trị.
3. Chuyển giữa thang logarit và tuyến tính tùy nhu cầu. Phát tệp gốc để nghe trong khi xem biểu đồ. Cả quá trình phân tích và phát lại đều diễn ra trên thiết bị của bạn.

## Cách đọc biểu đồ FFT

Công cụ giải mã ở 48 kHz, lấy các đoạn ngắn phân bố dọc theo tệp và áp dụng cửa sổ Hann trước khi phân tích bằng phép biến đổi Fourier nhanh (FFT). Công cụ lấy trung bình công suất của các đoạn và gộp các kênh stereo theo công suất. Nhờ vậy, âm thanh lệch pha giữa hai kênh vẫn hiện trên biểu đồ. Biểu đồ hiển thị tới 24 kHz. Mức tín hiệu được tính riêng cho từng khoảng tần số, nên khác với âm lượng tổng thể, mức đỉnh của mẫu tín hiệu hay độ lớn tích hợp theo LUFS.

Một đỉnh hẹp gần 50 hoặc 60 Hz có thể là tiếng ù do điện lưới. Mức tín hiệu tụt đột ngột ở dải tần cao có thể do lọc hoặc nén. Một đỉnh đơn lẻ có thể là một họa âm. Hãy xem các đỉnh lân cận trước khi dùng đỉnh đó để xác định cao độ của một nốt.

## Khi nào nên dùng thang logarit hoặc tuyến tính?

Thang logarit dành nhiều không gian hơn cho dải trầm và dải trung, giúp dễ theo dõi các quãng tám. Ở thang tuyến tính, các chênh lệch bằng nhau theo Hz chiếm cùng một khoảng trên trục. Cách này thuận tiện khi so sánh các họa âm cách đều nhau. Biểu đồ tóm tắt các thành phần tần số trong cả bản ghi. Nếu cần biết âm thanh xuất hiện lúc nào hoặc tần số thay đổi ra sao theo thời gian, hãy dùng phổ đồ.
