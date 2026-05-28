class Employee {
    constructor(account, fullName, email, password, startDate, basicSalary, position, monthlyWorkingHours) {
        this.account = account;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.startDate = startDate;
        this.basicSalary = Number(basicSalary);
        this.position = position;
        this.monthlyWorkingHours = Number(monthlyWorkingHours);

        this.totalSalary = Number(this.calcTotalSalary());
        this.rating = this.calcRating();
    }

    calcTotalSalary() {
        switch (this.position) {
            case "Sếp": return this.basicSalary * 3;
            case "Trưởng phòng": return this.basicSalary * 2;
            case "Nhân viên": return this.basicSalary;
            default: return 0;
        }
    }

    calcRating() {
        const time = this.monthlyWorkingHours;
        if (time >= 192) return "Nhân viên Xuất Sắc";
        else if (time >= 176) return "Nhân viên Giỏi";
        else if (time >= 160) return "Nhân viên Khá";
        else if (time < 160 && time > 0) return "Nhân viên Trung Bình";
        else return "Không xác định";
    }
}

export default Employee;