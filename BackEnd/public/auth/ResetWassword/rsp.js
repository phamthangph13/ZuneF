document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        alert("Liên kết không hợp lệ!");
        return;
    }


    document.querySelector('input[name="token"]').value = token;

    const form = document.getElementById("resetForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const response = await fetch(form.action + `?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newpassword: password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "/login";
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi đổi mật khẩu.");
        }
    });
});