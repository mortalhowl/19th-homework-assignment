/**============================================================================================================================
 * Import
 ============================================================================================================================*/
import Employee from "./employee.js";
import EmployeeManagement from "./employeeManagement.js";
import EmployeeValidation from "./employeeValidation.js";

/**============================================================================================================================
 * Helper
 ============================================================================================================================*/
const getId = (value) => document.getElementById(value)

/**============================================================================================================================
 * Init
 ============================================================================================================================*/
const manage = new EmployeeManagement();
const validate = new EmployeeValidation();

/**============================================================================================================================
 * DOM
 ============================================================================================================================*/
const btnAddEmployee = getId("btnThemNV");
const btnUpdEmployee = getId("btnCapNhat");
const btnAdd = getId("btnThem");
const txtModalHeader = getId("header-title");
const employeeList = getId("tableDanhSach");
const btnCloseEmployeeForm = getId("btnDong");
const employeeForm = document.querySelector("form[role='form']");
const searchRating = getId("searchName");

/**============================================================================================================================
 * Local Storage
 ============================================================================================================================*/
const getLocalStorage = (key, original) => {
    const savedData = localStorage.getItem(key);
    if (savedData) original = JSON.parse(savedData)
    // console.log(original);

    return original
}

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

/**============================================================================================================================
 * Info employee
 ============================================================================================================================*/

// Get info employee
const getInfoEmployee = () => {
    const account = getId("tknv").value;
    const fullName = getId("name").value;
    const email = getId("email").value;
    const password = getId("password").value;
    const startDate = getId("datepicker").value;
    const basicSalary = getId("luongCB").value;
    const position = getId("chucvu").value;
    const monthlyWorkingHours = getId("gioLam").value;

    return { account, fullName, email, password, startDate, basicSalary, position, monthlyWorkingHours }
}

// set info employee
const setInfoEmployee = (info) => {
    getId("tknv").value = info.account;
    getId("tknv").disabled = true;
    getId("name").value = info.fullName;
    getId("email").value = info.email;
    getId("password").value = info.password;
    getId("datepicker").value = info.startDate;
    getId("luongCB").value = info.basicSalary;
    getId("chucvu").value = info.position;
    getId("gioLam").value = info.monthlyWorkingHours;
}

/**============================================================================================================================
 * data validation
 ============================================================================================================================*/
const dataValidation = (info, isAdd) => {
    // spread operator (kiến thức ngoài lề) để giữ lại các field ko cần clean
    const cleanedData = { ...info };
    let isValid = true;

    // check account
    let accountValid = true;
    accountValid = validate.checkEmpty(info.account, "tbTKNV", "Tài khoản không được để trống");
    if (accountValid) accountValid = validate.checkLength(info.account, 4, 6, "tbTKNV", "Tài khoản phải từ 4 đến 6 ký số");
    if (accountValid) {
        const regex = /^\d{4,6}$/;
        accountValid = validate.checkFormat(info.account, regex, "tbTKNV", "Tài khoản phải là số");
    }

    if (isAdd && accountValid) {
        // console.log(`Đã chạy check trùng id`);
        accountValid = validate.checkAccountExist(info.account, manage.arr, "tbTKNV", "Tài khoản đã tồn tại")
    }

    // check fullName
    let fullNameValid = true;
    // Xóa các khoảng trắng thừa rồi mới validate
    const cleanFullNameInput = info.fullName.trim().replace(/\s+/g, " ");
    fullNameValid = validate.checkEmpty(cleanFullNameInput, "tbTen", "Họ và tên không được để trống");
    // đề bài ko giới hạn ký tự, nhưng nó sẽ nguy hiểm nếu đây là 1 đoạn mã độc=> chọn cách giới hạn cho an toàn
    if (fullNameValid) fullNameValid = validate.checkLength(cleanFullNameInput, 4, 50, "tbTen", "Họ và tên phải từ 4 đến 50 ký tự");
    if (fullNameValid) {
        const regex = /^[\p{L}\s+]+$/u;
        fullNameValid = validate.checkFormat(cleanFullNameInput, regex, "tbTen", "Tên nhân viên phải là chữ");
    }
    // console.log(cleanFullNameInput);
    cleanedData.fullName = cleanFullNameInput;

    // check email
    let emailValid = true;
    emailValid = validate.checkEmpty(info.email, "tbEmail", "Email không được để trống");
    // ở FE ko bắt lỗi type = email ?; check length cho an toàn
    if (emailValid) emailValid = validate.checkLength(info.email, 4, 50, "tbEmail", "Email phải từ 4 đến 50 ký tự");
    if (emailValid) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailValid = validate.checkFormat(info.email, regex, "tbEmail", "Định dạng email không hợp lệ");
    }

    // check password
    let passwordValid = true;
    passwordValid = validate.checkEmpty(info.password, "tbMatKhau", "Mật khẩu không được để trống");
    if (passwordValid) passwordValid = validate.checkLength(info.password, 6, 10, "tbMatKhau", "Mật khẩu phải từ 6 đến 10 ký tự");
    if (passwordValid) {
        const regex = /^(?!=.*\s)(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{6,10}$/; // dùng lookahead để kiểm tra lần lượt từng điều kiện 1
        passwordValid = validate.checkFormat(info.password, regex, "tbMatKhau", "Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt");
    }

    // check startDate
    let startDateValid = true;
    startDateValid = validate.checkEmpty(info.startDate, "tbNgay", "Ngày vào làm không được để trống");
    if (startDateValid) startDateValid = validate.checkLength(info.startDate, 10, 10, "tbNgay", "Ngày vào làm phải có 10 ký tự");
    if (startDateValid) {
        const regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
        startDateValid = validate.checkFormat(info.startDate, regex, "tbNgay", "Ngày vào làm phải được định dạng mm/dd/yyyy");
    }

    // check basicSalary
    /**
     * lương khi nhập sẽ có nhiều cách nhập như 1000000 or 1.000.000 or 1,000,000 or 1 000 000 vậy lúc này validate như nào mới đúng?
     */
    let basicSalaryValid = true;
    const cleanBasicSalaryInput = info.basicSalary.replace(/[,.\s]/g, "");
    // console.log((cleanBasicSalaryInput));
    basicSalaryValid = validate.checkEmpty(cleanBasicSalaryInput, "tbLuongCB", "Lương cơ bản không được để trống");
    if (basicSalaryValid) basicSalaryValid = validate.checkLength(cleanBasicSalaryInput, 7, 8, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000");
    if (basicSalaryValid) {
        const regex = /^\d{7,8}$/;
        basicSalaryValid = validate.checkFormat(cleanBasicSalaryInput, regex, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000");
    }
    if (basicSalaryValid) basicSalaryValid = validate.checkRange(cleanBasicSalaryInput, 1000000, 20000000, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000");
    cleanedData.basicSalary = Number(cleanBasicSalaryInput);

    // check position
    /**
     * ở cấu trúc html lại ko trả về value => LẤY TEXT 
     * ko cần check empty, length, format mà nên check so với giá trị đúng, có vẻ sẽ lằng nhằm
     * ở khoảng true position nhưng do ko có DB để check động nên phải fix cứng true value
     */
    let positionValid = true;
    const truePosition = ["Sếp", "Trưởng phòng", "Nhân viên"];
    positionValid = validate.checkFixValue(info.position, "Chọn chức vụ", "tbChucVu", "Chức vụ không được để trống")
    if (positionValid) positionValid = validate.checkSelect(info.position, truePosition, "tbChucVu", "Chức vụ không hợp lệ")
    // console.log(info.position);

    // check monthly working hours
    let monthlyWorkingHoursValid = true;
    monthlyWorkingHoursValid = validate.checkEmpty(info.monthlyWorkingHours, "tbGiolam", "Giờ làm không được để trống");
    if (monthlyWorkingHoursValid) monthlyWorkingHoursValid = validate.checkLength(info.monthlyWorkingHours, 2, 3, "tbGiolam", "Giờ làm trong tháng phải là ký số, từ 80 đến 200 giờ");
    if (monthlyWorkingHoursValid) {
        const regex = /\d{2,3}/;
        monthlyWorkingHoursValid = validate.checkFormat(info.monthlyWorkingHours, regex, "tbGiolam", "Giờ làm trong tháng phải là ký số, từ 80 đến 200 giờ");
    }
    if (monthlyWorkingHoursValid) monthlyWorkingHoursValid = validate.checkRange(info.monthlyWorkingHours, 80, 200, "tbGiolam", "Giờ làm trong tháng phải là ký số, từ 80 đến 200 giờ")
    cleanedData.monthlyWorkingHours = Number(info.monthlyWorkingHours);

    isValid &= accountValid && fullNameValid && emailValid && passwordValid && startDateValid && basicSalaryValid && positionValid && monthlyWorkingHoursValid;

    return {
        isValid: Boolean(isValid),
        cleanedData: isValid ? cleanedData : null,
    }
}

/**============================================================================================================================
 * Render
 ============================================================================================================================*/
const renderEmployee = (e) => {
    return `
        <tr>
            <td>${e.account}</td>
            <td>${e.fullName}</td>
            <td>${e.email}</td>
            <td>${e.startDate}</td>
            <td>${e.position}</td>
            <td>${e.totalSalary.toLocaleString("vi-VN")} VND</td>
            <td>${e.rating}</td>
            <td>
                <button onclick="handleUpd('${e.account}')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                    Edit
                </button>
                <button onclick="handleDel('${e.account}')" class="btn btn-danger">
                    Del
                </button>
            </td>
        </tr>
    `
}

const renderEmployeeList = (eList) => {
    employeeList.innerHTML = eList.map(renderEmployee).join("");
}

/**============================================================================================================================
 * Action in page
 ============================================================================================================================*/
// Add
btnAdd.addEventListener("click", () => {
    btnUpdEmployee.style.display = "none";
    btnAddEmployee.style.display = "block";
    getId("tknv").disabled = false;
    txtModalHeader.innerHTML = `Thêm nhân viên`;
})

// Del
const handleDel = (account) => {
    manage.delEmployee(account);
    setLocalStorage("EMPLOYEE_DATA", manage.arr);
    renderEmployeeList(manage.arr);
}

// Upd
const handleUpd = (account) => {
    btnUpdEmployee.style.display = "block";
    btnAddEmployee.style.display = "none";
    txtModalHeader.innerHTML = `Sửa nhân viên`;
    const info = manage.getEmployeeByAccount(account);
    setInfoEmployee(info);
}

// Search
searchRating.addEventListener("input", () => {
    const ratingValue = searchRating.value;
    const listResult = manage.findEmployeeByRating(ratingValue, manage.arr);
    renderEmployeeList(listResult);
})

/**============================================================================================================================
 * action in modal
 ============================================================================================================================*/
// Helper
const closeEmployeeForm = () => {
    btnCloseEmployeeForm.click()
    employeeForm.reset();

    const element = document.getElementsByClassName("sp-thongbao");
    for (let i = 0; i < element.length; i++) {
        element[i].style.display = "none";
    }
}

// Close
btnCloseEmployeeForm.addEventListener("click", closeEmployeeForm)

// Add
btnAddEmployee.addEventListener("click", () => {
    const info = getInfoEmployee();
    // console.log(info);

    // validation
    const checkData = dataValidation(info, true);

    if (checkData.isValid) {
        const employee = new Employee(
            checkData.cleanedData.account,
            checkData.cleanedData.fullName,
            checkData.cleanedData.email,
            checkData.cleanedData.password,
            checkData.cleanedData.startDate,
            checkData.cleanedData.basicSalary,
            checkData.cleanedData.position,
            checkData.cleanedData.monthlyWorkingHours,
        )

        manage.addEmployee(employee);
        // console.log(manage.arr);
        setLocalStorage("EMPLOYEE_DATA", manage.arr);
        renderEmployeeList(manage.arr);

        closeEmployeeForm();
    } else console.log(`Lỗi -1`);

})

// Upd
btnUpdEmployee.addEventListener("click", () => {
    const checkData = dataValidation(getInfoEmployee(), false);
    if (checkData.isValid) {
        const newEmployee = new Employee(
            checkData.cleanedData.account,
            checkData.cleanedData.fullName,
            checkData.cleanedData.email,
            checkData.cleanedData.password,
            checkData.cleanedData.startDate,
            checkData.cleanedData.basicSalary,
            checkData.cleanedData.position,
            checkData.cleanedData.monthlyWorkingHours,
        );
        console.log(newEmployee);

        manage.updEmployee(newEmployee.account, newEmployee);
        setLocalStorage("EMPLOYEE_DATA", manage.arr);
        renderEmployeeList(manage.arr);

        closeEmployeeForm();
    }
})

/**============================================================================================================================
 * Init
 ============================================================================================================================*/
window.handleUpd = handleUpd;
window.handleDel = handleDel;

manage.arr = getLocalStorage("EMPLOYEE_DATA", manage.arr);
renderEmployeeList(manage.arr);