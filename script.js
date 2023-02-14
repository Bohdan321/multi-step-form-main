/* Variables */
const form = document.getElementById("main-form");//?
// const userEmailInput = document.getElementById("user-email");
const userEmailInput = document.querySelector("input[type=email]");
const userNameInput = document.getElementById("user-name");
const userPhoneInput = document.getElementById("user-tel");
const plans = document.querySelectorAll("input[type=radio]");//?
const freeMonths = document.querySelectorAll("p.free-months")
const addons = Array.from(document.querySelectorAll(".form__add-on-card input[type=checkbox]"));
// const addons = document.querySelectorAll(".form__add-on-card input[type=checkbox]");
const switcher = document.getElementById("toggle-switcher");
const monthlySel = document.getElementById("selected-monthly");
const yearlySel = document.getElementById("selected-yearly");
const toggleSwitcher = document.getElementById("toggle-switcher");
const steps = document.querySelectorAll(".form__section-step");//?
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const confirmButton = document.getElementById("confirm-button");
const changeButton = document.getElementById("plan-change");
const stepNumbersInCircle = document.querySelectorAll("span.side-bar__circle");
const activeStep = document.querySelector(".form__section-step.active-step");


let billingType = "Monthly";
// console.log(steps);

/* Calling functions: */
form.addEventListener("submit", (e) => { e.preventDefault(); }); //?
checkingStep(document.querySelector(".form__section-step.active-step"));
setBillingType();
setCheckedPlanInput();
setCheckedAddons();
checkRightPositionOfSwitcher();
switcherToggleButton();
nextButtonDo();
confirmButtonDo();
backButtonDo();
changePlanButton();
updatePlanDo();
updateAddonsDo();
handleLastStep();


/* Definition of functions: */
/* Встановлення платіжного періоду місяць/рік : */
function setBillingType() {
    if (localStorage.getItem("billing_type")) {
        billingType = localStorage.billing_type;
        switcher.dataset.billing = localStorage.billing_type;
        updateValues();
        setSubscriptionPeriod();
    } else {
        localStorage.billing_type = "Monthly";
    }
}

function setCheckedPlanInput() {
    if (localStorage.getItem('plan')) {
        plans.forEach((plan) => {
            planObject = JSON.parse(localStorage.plan);
            if (plan.dataset.name == planObject.name) {
                plan.setAttribute("checked", true);
            }
            getPlansInformation();
        });
    } else {
        plan = {
            name: "Arcade",
            price: (document.querySelector("input[type=radio]:checked").dataset.value),
        };
        localStorage.setItem("plan", JSON.stringify(plan));
        getPlansInformation();
    }
}
function setCheckedAddons() {
    if (localStorage.getItem("addons_list")) {
        listOfAddons = JSON.parse(localStorage.addons_list);
        for (let i = 0; i < addons.length; i++) {
            listOfAddons.forEach((addon) => {
                if (addons[i].dataset.name == addon.name) {
                    addons[i].checked = true;
                }
            });
        }
    }
}



/* Перемикач періоду платежу:  */
function switcherToggleButton() {
    
    toggleSwitcher.addEventListener("change", () => {
        if (localStorage.billing_type == "Monthly") {
            localStorage.billing_type = "Yearly";
            billingType = localStorage.billing_type;
            toggleSwitcher.dataset.billing = localStorage.billing_type;
            updateValues();
            setSubscriptionPeriod()
        } else if (localStorage.billing_type == "Yearly") {
            localStorage.billing_type = "Monthly";
            billingType = localStorage.billing_type;
            toggleSwitcher.dataset.billing = localStorage.billing_type;
            updateValues();
            setSubscriptionPeriod();
        }
        handleLastStep();
    })
}
/* Оновлення значень цін в залежності від визначеного періоду */
function updateValues() {
    if (localStorage.billing_type == "Monthly") {
        plans.forEach((plan) => {
            plan.value = plan.dataset.value * 1;
            plan.nextElementSibling.children[1].textContent = `$${plan.value}/mo`;
        });
        addons.forEach((addon) => {
            addon.value = addon.dataset.value * 1;
            addon.nextElementSibling.nextElementSibling.textContent = `$${addon.value}/mo`;
        });
        freeMonths.forEach((p) => {
            p.classList.add("no-active");
        });
    } else if (localStorage.billing_type == "Yearly") {
        plans.forEach((plan) => {
            plan.value = plan.dataset.value * 10;
            plan.nextElementSibling.children[1].textContent = `$${plan.value}/yr`;
        });
        addons.forEach((addon) => {
            addon.value = addon.dataset.value * 10;
            addon.nextElementSibling.nextElementSibling.textContent = `$${addon.value}/yr`;
        });
        freeMonths.forEach((p) => {
            p.classList.remove("no-active");
        });
    }
}

/* Покажчик періоду місяць/рік */
function setSubscriptionPeriod() {
    if (localStorage.billing_type == "Monthly") {
        monthlySel.classList.remove("passive-value");
        yearlySel.classList.add("passive-value");
    } else if (localStorage.billing_type == "Yearly") {
        yearlySel.classList.remove("passive-value");
        monthlySel.classList.add("passive-value");
    }
}

/* Керування позначення/видимістю кнопок: назад, вперед, підтвердження   */
function checkingStep(step) {
    if (step) {
        if (step.dataset.index == 1) {
            backButton.classList.remove("visible");
        } else {
            backButton.classList.add("visible");
        }
        if (step.dataset.index == 4) {
            nextButton.classList.remove("visible");
            confirmButton.classList.add("visible");
        } else {
            nextButton.classList.add("visible");
            confirmButton.classList.remove("visible");
        }
    }
}

/* Рух по кроках: */
function moveWithStep(ArrayOfSteps, currentStep, targetStep) {
    if (!targetStep) return;
    ArrayOfSteps.forEach((step) => {
        step.classList.remove("active-step");
    });
    targetStep.classList.add("active-step");
}
/* Дії кнопки вперед */
function nextButtonDo() {
    nextButton.addEventListener("click", () => {
        currentStep = document.querySelector(".form__section-step.active-step");
        currentStepNumInCircle = document.querySelector(".side-bar__circle.active-step");
        targetStep = currentStep.nextElementSibling;
        if (!validateAllFields()) {
            moveWithStep(steps, currentStep, targetStep);
            moveWithStep(stepNumbersInCircle, currentStepNumInCircle, stepNumbersInCircle[parseInt(currentStepNumInCircle.dataset.index) + 1]);
            checkingStep(targetStep);
        };

    })
}
/* Дії кнопки вперед */
function backButtonDo() {
    backButton.addEventListener("click", () => {
        currentStep = document.querySelector(".form__section-step.active-step");
        currentStepNumInCircle = document.querySelector(".side-bar__circle.active-step");
        targetStep = currentStep.previousElementSibling;
        moveWithStep(steps, currentStep, targetStep);
        moveWithStep(stepNumbersInCircle, currentStepNumInCircle, stepNumbersInCircle[parseInt(currentStepNumInCircle.dataset.index) - 1]);
        checkingStep(targetStep);
    });
}

function confirmButtonDo() {
    confirmButton.addEventListener("click", () => {
        currentStep = document.querySelector(".form__section-step.active-step");
        targetStep = currentStep.nextElementSibling;
        if (!validateAllFields()) {
            moveWithStep(steps, currentStep, targetStep);
            checkingStep(targetStep);
            sendingForm(currentStep);

        };

    })
}



/* Зміна плану на четвертому кроці */
function changePlanButton() {
    changeButton.addEventListener("click", () => {
        moveWithStep(steps, steps[3], steps[1]);
        checkingStep(steps[1])
    })
}
/* Оновлення вибраного плану в локальному середовищі  */
function updatePlanDo() {
    plans.forEach((plan) => {
        plan.addEventListener("change", () => {
            let thePlan = {
                name: plan.dataset.name,
                price: plan.dataset.value,
            };
            localStorage.plan = JSON.stringify(thePlan);
            handleLastStep();
        });
    });
}
/* Оновлення вибраних значень аддонів в локальному середовищі */
function updateAddonsDo() {
    addons.forEach((addon) => {
        addon.addEventListener("change", () => {
            getAddonsDo(addons);
            handleLastStep();
        });
    });
}
/* Запис аддонів у локальне середовище пам'яті */
function getAddonsDo(AddonsList) {
    finalAddonsList = [];
    AddonsList.forEach((addon) => {
        if (addon.checked) {
            finalAddonsList.push({
                name: addon.dataset.name,
                price: addon.dataset.value,
            });
        }
    })
    localStorage.addons_list = JSON.stringify(finalAddonsList);
}

// /* Отримання інформації про план з локального сховища і запис  */
function getPlansInformation() {
    planHolder = document.querySelector("#plan-id");
    planPrice = document.getElementById("plan-price-id");
    plan = JSON.parse(localStorage.plan);
    planSubscription = localStorage.billing_type;
    planHolder.textContent = `${plan.name} (${planSubscription})`;
    planSubscription == "Monthly"
        ? (planPrice.textContent = `$${plan.price}/mo`)
        : (planPrice.textContent = `$${plan.price * 10}/yr`);
}

function printAddonsList() {
    if (localStorage.addons_list) {
        addonsList = JSON.parse(localStorage.addons_list);
        planSubscription = localStorage.billing_type;
        addonsListContainer = document.querySelector(".form__final-container .final__addons-container");//?
        addonsListContainer.textContent = "";
        for (i = 0; i < addonsList.length; i++) {
            finalItem = document.createElement("div");
            finalItem.className = "final__addon-item";
            addonName = document.createElement("h5");
            addonName.className = "final__addon-name";
            addonName.textContent = addonsList[i].name;
            addonPrice = document.createElement("p");
            addonPrice.className = "final__addon-price";
            planSubscription == "Monthly"
                ? (addonPrice.textContent = `+$${addonsList[i].price}/mo`)
                : (addonPrice.textContent = `+$${addonsList[i].price * 10}/yr`)
            finalItem.append(addonName);
            finalItem.append(addonPrice);
            addonsListContainer.append(finalItem);
        }
    }
}
/* Отримання сумарних значень для виведення на останню сторінку*/
function getTotalValues() {
    plan = JSON.parse(localStorage.plan);
    total = parseInt(plan.price);
    planSubscription = localStorage.billing_type;
    if (localStorage.addons_list) {
        theAddonsList = JSON.parse(localStorage.addons_list);
        for (let i = 0; i < theAddonsList.length; i++) {
            total += parseInt(theAddonsList[i].price);
        }
    }
    totalType = document.querySelector(".final__total-name");
    totalPrice = document.querySelector(".final__total-price");
    planSubscription == "Monthly" ?
        (totalType.textContent = `Total (per Month)`) :
        (totalType.textContent = `Total (per Year)`);
    planSubscription == "Monthly" ?
        (totalPrice.textContent = `+$${total}/mo`) :
        (totalPrice.textContent = `+$${total * 10}/yr`);
}
/* Виконання останнього кроку  */
function handleLastStep() {
    getPlansInformation();
    printAddonsList();
    getTotalValues();
}

/* Перевірка введення всіх даних користувача в поля введення  */
function validateAllFields() {
    let errors = 0;
    if (currentStep.dataset.index == 1) {
        errors += validateUserName();
        errors += validateUserEmail();
        errors += validateUserPhone();
    }
    return errors;
}
/* Перевірка введення електронної пошти користувача */
function validateUserEmail() {
    let emailError = userEmailInput.nextElementSibling;
    if (!userEmailInput.value) {
        emailError.textContent = "This field is required";
        emailError.className = "message-required active";
        userEmailInput.classList.add("required-frame");
        errors = 1;
    } else if (!userEmailInput.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{1,10}$/)) {
        emailError.textContent = "Please enter a valid email address";
        emailError.className = "message-required active";
        userEmailInput.classList.add("required-frame");
        errors = 1;
    } else {
        emailError.className = "message-required";
        userEmailInput.classList.remove("required-frame");
        errors = 0;
    }
    return errors;
}
/* Перевірка введення імені користувача */
function validateUserName() {
    let UserNameError = userNameInput.nextElementSibling;
    if (!userNameInput.value) {
        UserNameError.textContent = "This field is required";
        UserNameError.className = "message-required active";
        userNameInput.classList.add("required-frame");
        errors = 1;
    } else {
        UserNameError.className = "message-required";
        userNameInput.classList.remove("required-frame");
        errors = 0;
    }
    return errors;
}
/* Перевірка введення номеру телефону користувача */
function validateUserPhone() {
    let phoneError = userPhoneInput.nextElementSibling;
    if (!userPhoneInput.value) {
        phoneError.textContent = "This field is required";
        phoneError.className = "message-required active";
        userPhoneInput.classList.add("required-frame");
        errors = 1;
    } else {
        phoneError.className = "message-required";
        userPhoneInput.classList.remove("required-frame");
        errors = 0;
    }
    return errors;
}


function sendingForm(currentStep) {
    if (currentStep.dataset.index == 4) {
        let request = new XMLHttpRequest();
        request.open("GET", "#");
        request.onreadystatechange = () => {
            if (request.readyState = 4 && request.status == 200) {
                console.log("ready to send");
                /* ajax request logic */
            }
        };
        request.addEventListener("load", () => {
            CleanButtonsWhenShowThanks();
            cleanInputFields();
            setTimeout(redirectToTheFirstStep, 5000);
            console.log("sent successfully");
        });
        request.send();
    }
}
function CleanButtonsWhenShowThanks() {
    confirmButton.parentElement.style.display = "none";
}

function redirectToTheFirstStep() {
    nextButton.parentElement.style.display = "flex";
    moveWithStep(steps, steps[4], steps[0]);
    checkingStep(steps[0]);
    moveWithStep(stepNumbersInCircle, stepNumbersInCircle[3], stepNumbersInCircle[0]);

}
/* Очищення полів вводу особистих даних: */
function cleanInputFields() {
    userEmailInput.value = "";
    userNameInput.value = "";
    userPhoneInput.value = "";
}
function checkRightPositionOfSwitcher(){
    if (localStorage.billing_type == "Monthly"){
        toggleSwitcher.checked = "false";
    }
    if(localStorage.billing_type == "Yearly"){
        toggleSwitcher.checked = "true";
    }
}


