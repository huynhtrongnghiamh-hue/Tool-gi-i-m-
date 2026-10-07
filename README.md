🚀 AUTOMATED LUA DEOBFUSCATOR ENGINE
Bộ công cụ tự động phân tích, giải mã và làm sạch mã nguồn Lua trực tiếp trên Trình duyệt.
📌 Giới thiệu dự án
Auto Lua Deobfuscator Engine là công cụ web tĩnh (Client-Side) giúp lập trình viên và nhà phân tích mã nguồn khôi phục các đoạn script Lua đã bị làm mờ (obfuscated) bởi các công cụ bảo vệ code phổ biến.
Hệ thống hoạt động 100% trên trình duyệt người dùng — không tải code lên server, đảm bảo an toàn tuyệt đối và tốc độ xử lý tức thì.
✨ Tính năng nổi bật
🔓 Multi-layer String Decryptor: Tự động quét và giải mã các chuỗi bị giấu dưới dạng Hex (\xXX), Decimal (\DDD), Unicode, string.char(...) và mảng ký tự.
🧠 Emulated String Table: Giả lập bộ nhớ tạm để truy xuất và thay thế trực tiếp các mảng chuỗi bị mã hóa thành văn bản rõ ràng.
🧮 Constant Folding Engine: Tự động tính toán các biểu thức số học bị làm rối (ví dụ: 100 * 2 + 50 \rightarrow 250).
🧹 Control Flow Unflattening & Junk Clean: Loại bỏ các câu lệnh rác (if false, repeat...until true), comment bẫy và các đoạn code vô hiệu (Dead code).
🏷️ Variable Refactoring: Chuẩn hóa các tên biến rác phức tạp (_0x123a, illIIll) thành hệ thống tên gọn gàng (var_1, var_2).
🎨 Advanced Beautifier: Tự động căn chỉnh thụt lề, định dạng lại cấu trúc code chuẩn Lua cho dễ đọc.
🪝 Dynamic Hook Generator: Tự động nhận diện các bản mã hóa Lua VM cứng đầu và gắn kèm script bẫy load/loadstring để bắt mã nguồn gốc trong bộ nhớ.
🛠️ Hướng dẫn sử dụng
Truy cập vào trang web công cụ.
Dán đoạn code Lua cần giải mã vào ô MÃ GỐC (OBFUSCATED) hoặc bấm NẠP FILE LUA.
Bấm nút ⚡ QUÉT & GIẢI MÃ.
Xem kết quả trực tiếp tại ô MÃ SẠCH (DEOBFUSCATED) và bấm 💾 TẢI FILE SẠCH để lưu về máy.
👤 Tác giả & Phát triển (Author)
Dự án được xây dựng và phát triển bởi POR Hub Team.
Author / Developer: POR Hub
TikTok / Social: @por.top1
Project Focus: Tooling, Scripting, Lua Utilities & Automation
📄 Bản quyền (License)
Dự án này được phát hành dưới giấy phép MIT License.
