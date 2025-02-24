document.addEventListener("DOMContentLoaded", () => {
    function getElement(id) {
        return document.getElementById(id);
    }

    function showMessage(element, text, color = "red") {
        if (element) {
            element.textContent = text;
            element.style.color = color;
        }
    }

    function redirect(url, delay = 2000) {
        setTimeout(() => window.location.href = url, delay);
    }

    function handleRegister(event) {
        event.preventDefault();
        const username = getElement("register-username")?.value.trim();
        const email = getElement("register-email")?.value.trim();
        const password = getElement("register-password")?.value;
        const message = getElement("register-message");

        if (!username || !email || !password) {
            return showMessage(message, "All fields are required!");
        }

        if (localStorage.getItem(username)) {
            return showMessage(message, "Username already exists!");
        }

        localStorage.setItem(username, JSON.stringify({ 
            email, password, firstName: "", lastName: "", gender: "", dob: "" 
        }));
        showMessage(message, "Registration successful! Redirecting...", "green");
        redirect("index.html");
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = getElement("login-username")?.value.trim();
        const password = getElement("login-password")?.value;
        const message = getElement("login-message");

        if (!username || !password) {
            return showMessage(message, "Both fields are required!");
        }

        const storedUser = localStorage.getItem(username);
        if (!storedUser) return showMessage(message, "User not found!");

        const userData = JSON.parse(storedUser);
        if (userData.password !== password) return showMessage(message, "Incorrect password!");

        localStorage.setItem("loggedInUser", username);
        showMessage(message, "Login successful! Redirecting...", "green");
        redirect("home.html");
    }

    function loadProfile() {
        const username = localStorage.getItem("loggedInUser");
        if (!username) return redirect("index.html", 0);
        
        const userData = JSON.parse(localStorage.getItem(username));
        getElement("display-username").textContent = username;
        getElement("display-email").textContent = userData.email;
        getElement("first-name").value = userData.firstName || "";
        getElement("last-name").value = userData.lastName || "";
        getElement("dob").value = userData.dob || "";

        // Fix gender selection
        const genderInput = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
        if (genderInput) genderInput.checked = true;

        getElement("update-info").addEventListener("submit", (event) => {
            event.preventDefault();
            userData.firstName = getElement("first-name").value.trim();
            userData.lastName = getElement("last-name").value.trim();
            userData.gender = document.querySelector('input[name="gender"]:checked')?.value || "";
            userData.dob = getElement("dob").value;
            localStorage.setItem(username, JSON.stringify(userData));
            alert("Profile updated successfully!");
        });
    }

    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        redirect("index.html", 0);
    }

    function handleSurvey(event) {
        event.preventDefault();
        alert("Survey submitted successfully!");
        redirect("index.html", 2000);
    }

    function resetSurveyForm() {
        const surveyForm = document.querySelector(".survey-section");
        if (!surveyForm) return;

        surveyForm.querySelectorAll("input, select, textarea").forEach((field) => {
            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = false;
            } else {
                field.value = "";
            }
        });
    }

    function handleBackToTop() {
        const backToTopButton = getElement("back-to-top");
        if (!backToTopButton) return;

        window.addEventListener("scroll", () => {
            backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    getElement("register-form")?.addEventListener("submit", handleRegister);
    getElement("login-form")?.addEventListener("submit", handleLogin);
    getElement("logout-btn")?.addEventListener("click", handleLogout);
    getElement("submit-survey")?.addEventListener("click", handleSurvey);
    
    if (getElement("home-page")) loadProfile();
    
    const resetButton = getElement("reset-survey");
    if (resetButton) resetButton.addEventListener("click", resetSurveyForm);

    handleBackToTop();
});
