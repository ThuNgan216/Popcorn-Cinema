$(document).ready(function () {
    $("#tab-login").click(function (e) {
        e.preventDefault();
        $("#login-form").removeClass("hidden");
        $("#register-form").addClass("hidden");
        $("#tab-login").addClass("active");
        $("#tab-register").removeClass("active");
    });

    $("#tab-register").click(function (e) {
        e.preventDefault();
        $("#register-form").removeClass("hidden");
        $("#login-form").addClass("hidden");
        $("#tab-register").addClass("active");
        $("#tab-login").removeClass("active");
    });
});
function kiemtra() {
    var em = document.getElementById("em").value.trim();
    var pw = document.getElementById("pw").value.trim();

    const mail = /^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{6,10}$/;


    if (em === '' && pw === '') {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (em === '') {
        alert('Vui lòng nhập email!');
        return;
    }

    if (pw === '') {
        alert('Vui lòng nhập password!');
        return;
    }

    if (!mail.test(em)) {
        alert("Email không hợp lệ!");
        return;
    }

    if (!pwd.test(pw)) {
        alert("Password không hợp lệ!");
        return;
    }

    alert("Đăng ký thành công!");
}

function kiemtraDangKy() {
    var ht = document.getElementById("hoten").value.trim();
    var emdk = document.getElementById("emaildk").value.trim();
    var mk = document.getElementById("mkdk").value.trim();
    var nlmk = document.getElementById("nlmk").value.trim();
    var ns = document.getElementById("ngaysinh").value;
    var gt = document.getElementById("gioitinh").value;
    var dk = document.getElementById("dieukhoan").checked;

    const hoten = /^[A-Za-zÀ-ỹ\s]{2,50}$/;
    const mail = /^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const matkhau = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{6,10}$/;

    if (ht === '' && emdk === '' && mk === '' && nlmk === '' && ns === '') {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return false;
    }

    if (ht === '') {
        alert("Vui lòng nhập họ tên!");
        return false;
    }

    if (emdk === '') {
        alert("Vui lòng nhập email!");
        return false;
    }

    if (mk === '') {
        alert("Vui lòng nhập mật khẩu!");
        return false;
    }

    if (nlmk === '') {
        alert("Vui lòng nhập lại mật khẩu!");
        return false;
    }

    if (nlmk !== mk) {
        alert("Mật khẩu nhập lại không trùng khớp!");
        return false;
    }

    if (ns === '') {
        alert("Vui lòng chọn ngày sinh!");
        return false;
    }

    if (!hoten.test(ht)) {
        alert("Họ tên không hợp lệ!");
        return false;
    }

    if (!mail.test(emdk)) {
        alert("Email không hợp lệ!");
        return false;
    }

    if (!matkhau.test(mk)) {
        alert("Mật khẩu không hợp lệ! Mật khẩu phải từ 6 đến 20 ký tự, gồm chữ và số.");
        return false;
    }

    if (mk !== nlmk) {
        alert("Mật khẩu nhập lại không khớp!");
        return false;
    }

    if (!dk) {
        alert("Vui lòng đồng ý với chính sách và điều khoản sử dụng!");
        return false;
    }

    alert("Đăng ký thành công!");
    return true;
}