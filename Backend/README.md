# Daymark — TODO cá nhân

Ứng dụng quản lý công việc cá nhân viết bằng React, Vite và Tailwind CSS. Dữ liệu được lưu trong LocalStorage trên trình duyệt hiện tại; chưa cần backend.

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (thường là `http://localhost:5173`). Có thể mở thêm `http://localhost:5173/Bai1.html` nếu muốn dùng tệp HTML đang mở trong IDE.

## Build bản production

```bash
npm run build
npm run preview
```

## Chức năng

- Tab Hôm nay: danh sách task theo ngày, tìm kiếm, lọc trạng thái, đánh dấu hoàn thành, thêm/sửa/xóa task, giờ và mức ưu tiên.
- Tab Thống kê: số liệu hôm nay hoặc tuần này, biểu đồ theo ngày và nút thêm 10 task mẫu.
- LocalStorage tự lưu thay đổi để giữ dữ liệu sau khi tải lại trang.
