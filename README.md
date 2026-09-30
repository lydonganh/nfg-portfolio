# Portfolio SAP Consultant — hướng dẫn sử dụng

Trang này viết cho người **không chuyên code**. Làm theo từng mục là đủ.

## 1. Đây là gì

- Đây là **website tĩnh** (portfolio cá nhân): chỉ có file HTML/JSON/ảnh, **không có backend, không có database, không có đăng nhập**.
- Toàn bộ nội dung nằm ở 2 file:
  - `content/profile.json` — thông tin cá nhân (tên, kỹ năng, kinh nghiệm, liên hệ…).
  - `content/posts.json` — danh sách bài viết/dự án/công cụ.
- Trang **Liên hệ** chỉ hiển thị thông tin (email/phone/LinkedIn), **không có form gửi mail**.

## 2. Thiết lập một lần

1. Tạo repo trên GitHub, đặt chế độ **Private** (khuyến nghị — khả năng Netlify deploy được repo private `[Unverified]`, chưa kiểm chứng trong lần bàn giao này).
2. Tải **toàn bộ nội dung thư mục này** lên repo: GitHub web → *Add file → Upload files* → chọn tất cả → *Commit changes*.
3. Vào Netlify → *Add new site → Import from Git* → chọn repo vừa tạo.
4. Xong. `netlify.toml` đã cấu hình sẵn build command `node scripts/validate.js` → **JSON bị lỗi thì deploy fail, bản cũ vẫn live** (không hỏng trang đang chạy).

## 3. Đăng bài (chỉ chủ site)

Luôn làm trên GitHub web, không cần cài gì:

1. GitHub web → mở file `content/posts.json`.
2. Bấm nút hình bút (Edit) → thêm/sửa bài (xem bảng trường bên dưới).
3. *Commit changes* → Netlify tự deploy lại (~1 phút).

**Bảng mô tả trường của một bài** (mỗi phần tử của mảng `posts.json`):

| Trường | Áp dụng | Ý nghĩa |
|---|---|---|
| `id` | tất cả, **bắt buộc, duy nhất** | Dùng làm link: `#/item/<id>` |
| `type` | tất cả, **bắt buộc** | `project` \| `video` \| `guide` \| `tool` |
| `title` | tất cả, **bắt buộc** | Tiêu đề |
| `module` | tất cả | Mảng mã module, ví dụ `["QM","PP"]` |
| `summary`, `date` (YYYY-MM-DD) | tất cả | Tóm tắt; ngày để sắp xếp |
| `featured` | tất cả | `true` → hiện ở trang chủ |
| `sample` | tất cả | `true` → hiện nhãn "Dữ liệu mẫu" |
| `status` | tất cả | `"draft"` → ẩn khỏi giao diện (vẫn public trong JSON — xem mục 7) |
| `client`, `role`, `period`, `system`, `context` | project | Thông tin dự án |
| `results[]` `{ v, l }` | project | Ô số kết quả |
| `work[]`, `outcomes[]`, `apps[]` | project | Danh sách |
| `appName`, `level` (`Cơ bản`/`Nâng cao`) | video, guide, tool | Tên app + trình độ |
| `duration`, `thumbnail`, `embedUrl` | video | `embedUrl` dạng `https://www.youtube.com/embed/<id>` |
| `purpose`, `prerequisites`, `scribeUrl` | guide | Mục đích / điều kiện / link Scribe |
| `steps[]` `{ text, image }` | guide | `image` là đường dẫn tương đối, ví dụ `assets/img/<id>/buoc-1.png` |
| `url` | tool | Đường dẫn tới file công cụ |

Lưu ý thêm về `content/profile.json`: cờ `demo: true` → hiện nhãn "Bản demo · nội dung mẫu"; các trường `photo`, `cvUrl`, `status`, `email`, `phone`, `linkedin` để `""` sẽ ẩn phần tương ứng.

## 4. Thêm/sửa thông tin cá nhân

- Sửa file `content/profile.json` (cũng trên GitHub web) → *Commit changes* → chờ Netlify deploy.
- Trước khi **public thật**: đặt `"demo": false` để bỏ nhãn "Bản demo · nội dung mẫu".

## 5. Upload ảnh

1. Đặt ảnh vào thư mục `assets/img/<id-bài>/` (ví dụ `assets/img/trien-khai-f-and-b/buoc-1.png`).
2. Trong bài viết, khai báo `"image": "assets/img/<id-bài>/buoc-1.png"` (đường dẫn **tương đối**, không có `..`).
3. **Tuyệt đối làm mờ dữ liệu khách hàng** trước khi commit: tên nhà cung cấp, số lô/batch, tên nhân viên, link nội bộ, ảnh màn hình SAP có dữ liệu thật.
4. Nếu khai báo `image` mà chưa up file lên → script kiểm tra sẽ **fail deploy** và báo đúng tên ảnh thiếu.

## 6. Deploy lỗi thì làm gì

1. Vào Netlify → mục *Deploys* → bấm deploy màu đỏ vừa xảy ra.
2. Mở *Build log*.
3. Đọc dòng bắt đầu bằng `❌ …` — đó là lỗi do `scripts/validate.js` chặn lại (JSON sai, thiếu trường, trùng id, đường dẫn ảnh không hợp lệ…).
4. Sửa `content/*.json` rồi commit lại là deploy sẽ chạy tiếp.

## 7. Cảnh báo `draft`

- Bài có `"status": "draft"` sẽ **ẩn trên giao diện** (không hiện ở trang chủ, trang danh sách, không mở qua link trang).
- Nhưng file `content/posts.json` vẫn được **công khai** — ai có link `.../content/posts.json` vẫn đọc được toàn bộ nội dung bài draft.
- **Đừng ghi bí mật** (mật khẩu, thông tin nội bộ chưa duyệt) vào bài draft.

## 8. Xem thử trên máy

```
npx serve .
```
rồi mở `http://localhost:8080`.

- **Double-click `index.html` (mở bằng `file://`) sẽ báo lỗi tải dữ liệu** — bình thường, do trình duyệt chặn đọc file JSON khi mở trực tiếp. Muốn xem phải dùng `npx serve .` như trên.
- Muốn kiểm tra nhanh dữ liệu có hợp lệ không: `node scripts/validate.js`.

## 9. Card "Công cụ" và link bài hướng dẫn

- Card Công cụ (trang chủ + trang Công cụ) và nút "Mở công cụ" trỏ tới **`https://nfg-link-sap.netlify.app/`** (bản đã deploy trên Netlify).
- Bài hướng dẫn "Đính kèm file link vào Inspection Lot" cũng nhúng trang này qua trường `scribeUrl`.
- File gốc `tools/Tao_Link_Shortcut_SAP.html` **không kèm trong repo** (chứa ảnh dữ liệu khách hàng). Nếu đổi đường dẫn card về file local khi chưa thêm file, card sẽ trả **404** — muốn chạy local thì tự thêm file đã làm mờ vào thư mục `tools/`.

## 10. Giữ nguyên footer

Không sửa, không xóa câu ở chân trang:

> Lấy cảm hứng từ SAP Fiori, không liên kết với SAP SE.

Kèm theo: **không dùng logo SAP, không đặt tên site là sap.com** — giữ ranh giới này để không vi phạm thương hiệu.
