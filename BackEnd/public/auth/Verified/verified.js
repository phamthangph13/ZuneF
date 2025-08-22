document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status"); // success hoặc fail

    const title = document.getElementById("title");
    const message = document.getElementById("message");

    if (status === "success") {
        title.textContent = "Xác minh thành công!";
        message.textContent = "Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.";
    } else if (status === "fail") {
        title.textContent = "Xác minh thất bại!";
        message.textContent = "Liên kết xác minh không hợp lệ hoặc đã hết hạn.";
    } else {
        title.textContent = "Thông báo";
        message.textContent = "Có lỗi xảy ra khi xác minh tài khoản.";
    }
});