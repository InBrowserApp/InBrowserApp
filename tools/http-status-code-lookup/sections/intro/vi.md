## Ma trang thai HTTP la gi?

Ma trang thai HTTP la cac ma phan hoi gom ba chu so do may chu tra ve de cho biet dieu gi da xay ra voi mot yeu cau. Ban se thuong thay chung trong cong cu nha phat trien cua trinh duyet, phan hoi API, log may chu, he thong giam sat uptime va bang dieu khien reverse proxy.

### Cach doc cac nhom ma trang thai chinh

- **1xx Thong tin:** May chu da nhan yeu cau va qua trinh xu ly van dang tiep tuc.
- **2xx Thanh cong:** Yeu cau da hoan thanh thanh cong.
- **3xx Chuyen huong:** Client can theo mot dia chi khac hoac dung lai ket qua da duoc cache.
- **4xx Loi client:** Van de nam o chinh yeu cau, vi du nhu thieu tai nguyen, dau vao khong hop le hoac xac thuc that bai.
- **5xx Loi server:** May chu hoac mot phu thuoc upstream da that bai khi xu ly mot yeu cau hop le.

### Khi nao lookup nay huu ich

Hay dung cong cu nay khi ban can xac nhan y nghia cua mot ma, so sanh cac ma gan nhau nhu 401 va 403 hoac 502 va 504, hoac tim theo mot cum tu trong thong bao loi. Cong cu ho tro tim theo ma, ten trang thai va mo ta da duoc ban dia hoa.

### Vi sao viec dien giai dung lai quan trong

Khi giai loi, ma trang thai thuong la manh moi nhanh nhat. Phan hoi 4xx thuong chi den yeu cau, thong tin xac thuc hoac tai nguyen dich. Phan hoi 5xx thuong chi den ung dung, gateway hoac dich vu upstream. Doc danh muc truoc se giup ban chon buoc tiep theo dung hon.
