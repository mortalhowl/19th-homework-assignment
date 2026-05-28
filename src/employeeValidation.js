// Helper
const getId = (value) => {
    return document.getElementById(value)
}

// Class
class EmployeeValidation {
    showError(idError, message) {
        const element = getId(idError);

        element.innerHTML = message;
        element.style.display = "block";
        return false
    }

    delError(idError) {
        const element = getId(idError);

        element.innerHTML = ""; // reset lại cho an toàn
        element.style.display = "none";
        return true
    }

    // Check empty
    checkEmpty(value, idError, message) {
        if (value.trim() === "") return this.showError(idError, message);
        return this.delError(idError);
    }

    // check Length
    checkLength(value, min, max, idError, message) {
        if (value.length < min || value.length > max) return this.showError(idError, message);
        return this.delError(idError);
    }

    // Check Format dùng regex
    checkFormat(value, regex, idError, message) {
        if (!regex.test(value)) return this.showError(idError, message);
        return this.delError(idError);
    }

    // Check Select
    checkSelect(value, trueSelect, idError, message) {
        if (!trueSelect.includes(value)) return this.showError(idError, message);
        return this.delError(idError);
    }

    // Check Range
    checkRange(value, min, max, idError, message) {
        if (!(value >= min && value <= max)) return this.showError(idError, message);
        return this.delError(idError);
    }
}

export default EmployeeValidation;