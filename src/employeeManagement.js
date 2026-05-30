class EmployeeManagement {
    constructor() {
        this.arr = [];
    }

    getIndexByAccount(account) {
        let idx = -1;
        for (let i = 0; i < this.arr.length; i++) {
            if (String(this.arr[i].account) === String(account)) {
                idx = i;
                break;
            }
        }
        if (idx === -1) {
            console.log(`Không tìm đươc index (-1)`);
            return
        }

        return idx
    }

    getEmployeeByAccount(account) {
        const idx = this.getIndexByAccount(account);
        return this.arr[idx]
    }

    addEmployee(employee) {
        this.arr.push(employee);
    }

    delEmployee(account) {
        const idx = this.getIndexByAccount(account);
        if (idx !== -1) {
            this.arr.splice(idx, 1);
            console.log(`Xóa thành công account: ${account}`);
        }
    }

    updEmployee(account, newEmployee) {
        const idx = this.getIndexByAccount(account);
        this.arr[idx] = newEmployee;
    }

    findEmployeeByRating(value, arr) {
        const searchResult = arr.filter(e => e.rating.toLowerCase().includes(value.trim()));
        return searchResult
    }
}

export default EmployeeManagement;