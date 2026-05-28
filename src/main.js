// Import
import Employee from "./employee.js";
import EmployeeManagement from "./employeeManagement.js";
import EmployeeValidation from "./employeeValidation.js";

// Helper
const getId = (value) => {
    return document.getElementById(value)
}

const getClass = (value, target) => {
    return document.getElementsByClassName(value)[target];
}

// Init
const manage = new EmployeeManagement();
const validate = new EmployeeValidation();

// DOM
const btnAddEmployee = getId("btnThemNV");

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

// data validation
const dataValidation = (info) => {
    let inValid = true;

    // check account
    let accountValid = true;
    accountValid = validate.checkEmpty(info.account, "tbTKNV", "Tài khoản không được để trống");
    if (accountValid) accountValid = validate.checkLength(info.account, 4, 6, "tbTKNV", "Tài khoản phải từ 4 đến 6 ký số");
    if (accountValid) {
        const regex = /^\d{4,6}$/;
        accountValid = validate.checkFormat(info.account, regex, "tbTKNV", "Tài khoản phải là ký số");
    }

    // check fullName

    // Nếu chỉ xét ở mức regex cơ bản thì sẽ dùng [a-zA-ZÁ-ỹ\s] => hợp lú => tiềm ẩn rủi ro về các ký tự toán học cũng như các ký tự la tinh đến từ format [Á-ỹ] => Trên mạng bảo thế :))
    // Nếu như chính xác hơn thì dùng \p{L} cùng với mã unicode
    // về dấu cách => nếu xét về UX => nên cho nhập dư khoảng cách => format lại bằng cách thay thế nhiều dấu cách bằng 1 dấu cách => .replace(/\s+/g, " ")

    let fullNameValid = true;
    const cleanFullNameInput = info.fullName.trim().replace(/\s+/g, " ");
    fullNameValid = validate.checkEmpty(cleanFullNameInput, "tbTen", "Họ và tên không được để trống");
    if (fullNameValid) fullNameValid = validate.checkLength(cleanFullNameInput, 4, 50, "tbTen", "Họ và tên phải từ 4 đến 50 ký tự"); // đề bài ko giới hạn ký tự, nhưng nó sẽ nguy hiểm nếu đây là 1 đoạn mã => chọn cách giới hạn cho an toàn
    if (fullNameValid) {
        const regex = /^[\p{L}\s+]+$/u;
        fullNameValid = validate.checkFormat(cleanFullNameInput, regex, "tbTen", "Tên nhân viên phải là chữ");
    }
    console.log(cleanFullNameInput);


    // check email
    let emailValid = true;
    emailValid = validate.checkEmpty(info.email, "tbEmail", "Email không được để trống");
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
    if (startDateValid) startDateValid = validate.checkLength(info.startDate, 10, 10, "tbNgay", "Ngày vào làm phải được định dạng mm/dd/yyyy");
    if (startDateValid) {
        const regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
        startDateValid = validate.checkFormat(info.startDate, regex, "tbNgay", "Ngày vào làm phải được định dạng mm/dd/yyyy");
    }

    // check basicSalary
    /**
     * Vấn đề là lương khi nhập sẽ có nhiều cách nhập như 1000000 or 1.000.000 or 1,000,000 or 1 000 000 vậy lúc này validate như nào mới đúng?
     * Nếu dùng regex thì chắc nhắn sẽ cực dài => Ưu tiên dùng js cho việc format số => Đọc trên mạng bảo z kkk
     */
    let basicSalaryValid = true;
    const cleanBasicSalaryInput = info.basicSalary.replace(/[,.\s]/g, "");
    console.log((cleanBasicSalaryInput));

    basicSalaryValid = validate.checkEmpty(cleanBasicSalaryInput, "tbLuongCB", "Lương cơ bản không được để trống");
    if (basicSalaryValid) basicSalaryValid = validate.checkLength(cleanBasicSalaryInput, 7, 8, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000");
    if (basicSalaryValid) {
        const regex = /^\d{7,8}$/;
        basicSalaryValid = validate.checkFormat(cleanBasicSalaryInput, regex, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000");
    }
    if (basicSalaryValid) basicSalaryValid = validate.checkRange(cleanBasicSalaryInput, 1000000, 20000000, "tbLuongCB", "Lương cơ bản phải là số từ 1.000.000 - 20.000.000")

    // check position
    /**
     * ở cấu trúc html lại ko trả về value => LẤY TEXT 
     * ko cần check empty, length, format mà nên check so với giá trị đúng, có vẻ sẽ lằng nhằm
     * ở khoảng true position nhưng do ko có DB để check động nên phải fix cứng true value
     */
    let positionValid = true;
    const truePosition = ["Sếp", "Trưởng phòng", "Nhân viên"];
    positionValid = validate.checkSelect(info.position, truePosition, "tbChucVu", "Chức vụ không hợp lệ")
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

    inValid &= accountValid && fullNameValid && emailValid && passwordValid && startDateValid && basicSalaryValid && positionValid && monthlyWorkingHoursValid;
    return inValid
}

btnAddEmployee.addEventListener("click", () => {
    const info = getInfoEmployee();
    // console.log(info);

    // validation
    const checkDataValidaion = dataValidation(info);

    if (checkDataValidaion) {
        const employee = new Employee(
            info.account,
            info.fullName,
            info.email,
            info.password,
            info.startDate,
            info.basicSalary,
            info.position,
            info.monthlyWorkingHours,
        )

        manage.addEmployee(employee);
        console.log(manage.arr);
    } else console.log(`Lỗi -1`);

})