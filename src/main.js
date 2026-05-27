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
    let fullNameValid = true;
    fullNameValid = validate.checkEmpty(info.fullName, "tbTen", "Họ và tên không được để trống");
    if (fullNameValid) fullNameValid = validate.checkLength(info.fullName, 4, 50, "tbTen", "Họ và tên phải từ 4 đến 50 ký tự"); // đề bài ko giới hạn ký tự, nhưng nó sẽ nguy hiểm nếu đây là 1 đoạn mã => chọn cách giới hạn cho an toàn
    if (fullNameValid) {
        // Nếu chỉ xét ở mức regex cơ bản thì sẽ dùng [a-zA-ZÁ-ỹ\s] => hợp lú => tiềm ẩn rủi ro về các ký tự toán học cũng như các ký tự la tinh đến từ format [Á-ỹ]
        // Nếu như chính xác hơn thì dùng \p{L} cùng với mã unicode
        // về dấu cách => nếu xét về UX => nên cho nhập dư khoảng cách => format lại bằng cách thay thế nhiều dấu cách bằng 1 dấu cách => .replace(/\s+/g, " ")

        const regex = /^[\p{L}\s+]+$/u;
        fullNameValid = validate.checkFormat(info.fullName, regex, "tbTen", "Tên nhân viên phải là chữ");
    }

    // check email
    let emailValid = true;
    emailValid = validate.checkEmpty(info.email, "tbEmail", "Email không được để trống");
    if (emailValid) emailValid = validate.checkLength(info.email, 4, 50, "tbEmail", "Email phải từ 4 đến 50 ký tự");
    if (emailValid) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailValid = validate.checkFormat(info.email, regex, "tbEmail", "Định dạng email không hợp lệ");
    }

    // check password

    // check startDate

    // check basicSalary

    // check position

    // check monthly working hours


    inValid &= accountValid && fullNameValid && emailValid;
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