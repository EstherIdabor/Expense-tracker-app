const welcomePage = document.querySelector(".welcome--page");
const signUpLink = document.querySelector(".sign-up");
const signInLink = document.querySelector(".sign-in");
const welcomeMessage = document.querySelector(".welcome-message");
const nameWelcome = document.querySelector(".welcome-div__Name");

const registerForm = document.querySelector(".Registration-form");
const firstName = document.querySelector("#fname");
const lastName = document.querySelector("#lname");
const registerPassword = document.querySelector("#password");
const registration = document.querySelector(".registration");

const loginForm = document.querySelector(".login-form");
const fullName = document.querySelector("#Fname");
const loginPassword = document.querySelector("#login-password");
const login = document.querySelector(".login");

const mainPage = document.querySelector(".homepage");

let formControl = document.querySelectorAll(".form-control");

const expenseValue = document.querySelector(".expense-value");
const budgetDisplayValue = document.querySelector(".budget-value");
const budgetTimeFrameAmount = document.querySelector(
  ".budget-timeframe-amount"
);
let calcBudgetPerTimeframe;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let userObject = {};
let expenseArr = [];
let budgetFieldValue = 0;

///////////////// WELCOME PAGE //////////////////////////////
signUpLink.addEventListener("click", function (e) {
  e.preventDefault();

  welcomePage.classList.add("hidden");
  registration.classList.remove("hidden");
});

signInLink.addEventListener("click", function (e) {
  e.preventDefault();

  welcomePage.classList.add("hidden");
  login.classList.remove("hidden");
});
//////////////// FORM VALIDATION ////////////////////////////

formControl = Array.from(formControl);

const checkName = function (input) {
  const inputValue = input.value;
  if (inputValue.length === 0) {
    displayError(input, "This field is required");
  } else {
    hideError(input);
  }
};

const checkPassword = function (input) {
  const inputValue = input.value;
  if (inputValue.length === 0) {
    displayError(input, "Enter a pin");
  } else if (inputValue.length < 4) {
    displayError(input, "Pin cannot be less than 4");
  } else {
    hideError(input);
  }
};

const displayError = function (input, message) {
  const formControlDiv = input.parentElement;
  formControlDiv.classList = "form-control error";
  input.nextElementSibling.innerHTML = message;
};

const hideError = function (input) {
  const formControlDiv = input.parentElement;
  formControlDiv.classList = "form-control";
  input.nextElementSibling.innerHTML = "";
};

////////////SET LOCAL STORAGE //////////
const setUserLocalStorage = function () {
  localStorage.setItem("userObject", JSON.stringify(userObject));
};

const setExpenseLocalStorage = function () {
  localStorage.setItem("expenseArr", JSON.stringify(expenseArr));
};
////////// REGISTRATION  ///////////////////

const checkRegistrationInput = function () {
  checkName(firstName);
  checkName(lastName);
  checkPassword(registerPassword);
};

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  checkRegistrationInput();

  if (!formControl.some((el) => el.classList.contains("error"))) {
    registration.classList.add("hidden");
    mainPage.classList.remove("hidden");
    welcomeMessage.textContent = "Welcome to your page";
    setTimeout(() => mainPage.classList.add("show"), 500);
    nameWelcome.textContent = `Hello, ${firstName.value}`;
    userObject.Name = firstName.value;
    userObject.Surname = lastName.value;
    userObject.Fullname = (firstName.value + lastName.value).toLowerCase();
    userObject.Password = +registerPassword.value;

    setUserLocalStorage();
  }
});

//////// LOGIN ////////////////////

const checkLoginInput = function () {
  checkName(fullName);
  checkPassword(loginPassword);
};

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  checkLoginInput();

  userObject = JSON.parse(localStorage.getItem("userObject"));
  expenseArr = JSON.parse(localStorage.getItem("expenseArr"));

  const storedFullName = userObject.Fullname;
  const storedPin = userObject.Password;
  totalExpense = userObject.Totalexpense ? userObject.Totalexpense : 0;
  budgetFieldValue = userObject.Budget ? userObject.Budget : 0;

  if (
    !formControl.some((el) => el.classList.contains("error")) &&
    fullName.value.replace(/\s/g, "").toLowerCase() == storedFullName &&
    +loginPassword.value == +storedPin
  ) {
    login.classList.add("hidden");
    mainPage.classList.remove("hidden");
    welcomeMessage.textContent = "Welcome back to your page";
    nameWelcome.textContent = `Hello, ${userObject.Name}`;
    setTimeout(() => mainPage.classList.add("show"), 500);

    calcBudgetPerTimeframe =
      userObject.BudgetTimeframe == "Monthly"
        ? `${formatter.format(+budgetFieldValue / 4)}/Week`
        : `${formatter.format(+budgetFieldValue / 12)}/Month`;

    expenseValue.textContent = `${formatter.format(totalExpense)}`;
    budgetDisplayValue.textContent = formatter.format(budgetFieldValue);
    budgetTimeFrameAmount.textContent = calcBudgetPerTimeframe;

    updateBudgetSummary();
    displayExpenseList();
  }
});

///////////////////// MODAL ///////////////////////////////
const openBudgetModal = document.querySelector(".add-budget");
const openExpenseModal = document.querySelector(".add-expense");

const budgetModal = document.querySelector(".modal-section-budget");
const expenseModal = document.querySelector(".modal-section-expense");
const editExpenseModal = document.querySelector(".modal-section-edit-expense");
const budgetCloseIcon = document.querySelector(".budget-close-icon");
const expenseCloseIcon = document.querySelector(".expense-close-icon");
const editExpenseCloseIcon = document.querySelector(".edit-expense-close-icon");
const overlay = document.querySelector(".overlay");

// /////////////////////////
const closeBudgetModal = function () {
  budgetModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
const closeExpenseModal = function () {
  expenseModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
const closeEditExpenseModal = function () {
  editExpenseModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
openBudgetModal.addEventListener("click", function () {
  budgetModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

budgetCloseIcon.addEventListener("click", closeBudgetModal);

/////////DELETE ICON
const deleteModal = document.querySelector(".confirm-delete");

const openDeleteModal = function () {
  deleteModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeDeleteModal = function () {
  deleteModal.classList.add("hidden");
  overlay.classList.add("hidden");
};
document.querySelector(".cancel-btn").addEventListener("click", function () {
  closeDeleteModal();
});

/////////OVERLAY///////////
overlay.addEventListener("click", function () {
  closeBudgetModal();
  closeExpenseModal();
  closeEditExpenseModal();
  closeDeleteModal();
});

openExpenseModal.addEventListener("click", function () {
  expenseModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

expenseCloseIcon.addEventListener("click", closeExpenseModal);
editExpenseCloseIcon.addEventListener("click", closeEditExpenseModal);

////////////////////////// MODAL FORMS /////////////////////////

//////// BUDGET////////////////
const budgetForm = document.querySelector(".budget-form");
const budgetField = document.querySelector("#budget");
const budgetFormControl = document.querySelector(".budget-form-control");

const selectBox = document.querySelector(".select-box");
const budgetTimeFrame = document.querySelector(".budget-timeframe");

////////// Add/Change budget /////////////////////
budgetForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (budgetField.value == "") {
    budgetFormControl.classList.add("error");
  } else {
    budgetFormControl.classList.remove("error");
    budgetFieldValue = +budgetField.value;
  }
  let selectBoxValue = selectBox.value;
  let calcBudgetPerTimeframe =
    selectBoxValue == "Monthly"
      ? `${formatter.format(+budgetFieldValue / 4)}/Week`
      : `${formatter.format(+budgetFieldValue / 12)}/Month`;
  if (!budgetFormControl.classList.contains("error")) {
    budgetDisplayValue.textContent = formatter.format(budgetFieldValue);
    budgetTimeFrame.textContent = `${selectBoxValue} Budget`;
    budgetTimeFrameAmount.textContent = calcBudgetPerTimeframe;

    closeBudgetModal();
    updateBudgetSummary();
    userObject.Budget = budgetFieldValue;
    userObject.BudgetTimeframe = selectBoxValue;
    setUserLocalStorage();
  }
});

// ////////////////EXPENSES //////////////////////////////
const expenseList = document.querySelector(".Expense-list");

/////// Expense data /////////////

const displayHtmlExpenseItem = function (item) {
  let htmlExpenseItem = `
  <div class="expense-container" id = "${item.id}">
      <div class="modify-icon">
        <a href="#" class="edit-icon"><i class="fa-solid fa-pen-to-square" style="color: #254b8e;"></i></a>
        <a href="#" class="delete-icon"><i class="fa-solid fa-trash-can" style="color: #e75a61;"></i></a>
      </div>
      <div class="expense-item">
        <div class="expense">
        <h2 class="semi-weighted-text expense-item__Title">${item.Title}</h2>
        <p class="normal-text expense-item__date">${item.date}</p>
        </div>
        <div class="amount">
        <h2 class="semi-weighted-text expense-item__Amount">$${item.Amount}</h2>
        </div>
        </div> 
  </div>      
`;

  return htmlExpenseItem;
};

const displayExpenseList = function () {
  expenseList.innerHTML = "";
  const expenseArrHtml = expenseArr.reduce((acc, currentEL) => {
    return acc + displayHtmlExpenseItem(currentEL);
  }, "");

  expenseList.innerHTML = expenseArrHtml;
};

let totalExpense = 0;
/////////////UPDATE BUDGET REMAINING/ BDGET SUMMARY/////////
const displayBudgetPercent = document.querySelector("#budget-percent");
const progressCircle = document.querySelector(".outer");
const displayBudgetExceeded = document.querySelector(".budget-exceeded");

function updateBudgetSummary() {
  let percentageExpenses = `${Math.round(
    ((budgetFieldValue - totalExpense) / budgetFieldValue) * 100
  )}%`;
  if (!budgetFieldValue == 0) {
    displayBudgetPercent.textContent = percentageExpenses;

    let colorDeg = ((budgetFieldValue - totalExpense) / budgetFieldValue) * 360;

    progressCircle.style.backgroundImage = `conic-gradient(var(--light-blue) ${
      colorDeg - 2
    }deg, white ${colorDeg + 2}deg)`;
  }

  if (totalExpense > budgetFieldValue) {
    percentageExpenses = `0%`;
    displayBudgetPercent.textContent = percentageExpenses;

    let colorDeg = 0;

    progressCircle.style.backgroundImage = `conic-gradient(var(--light-blue) ${
      colorDeg - 2
    }deg, white ${colorDeg + 2}deg)`;
    displayBudgetExceeded.textContent = "Budget exceeded";
  } else {
    displayBudgetExceeded.textContent = "";
  }
}

/////////////////////// EXPENSE MODAL////////////////
const expenseForm = document.querySelector(".expense-form");
const expenseAmount = document.querySelector("#expense-amount");
const expenseTitle = document.querySelector("#expense-title");
const expenseDate = document.querySelector("#expense-date");
expenseDate.valueAsDate = new Date();

// Adding an Expense//////////////////////////////////

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const derivedDate = new Date(expenseDate.value).toLocaleDateString("en-us", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
  const timeStamp = Math.floor(Math.random() * 100) + `${Date.now()}`.slice(-4);

  let expenseTitleValue = expenseTitle.value;
  let expenseAmountValue = +expenseAmount.value;
  totalExpense += expenseAmountValue;

  let expenseItem = {
    Title: expenseTitleValue,
    Amount: expenseAmountValue,
    date: derivedDate,
    id: `${timeStamp}`,
  };

  expenseArr.unshift(expenseItem);
  updateBudgetSummary();

  expenseList.insertAdjacentHTML(
    "afterbegin",
    displayHtmlExpenseItem(expenseItem)
  );
  expenseValue.textContent = `${formatter.format(totalExpense)}`;
  closeExpenseModal();

  expenseTitle.value = "";
  expenseAmount.value = "";
  expenseDate.valueAsDate = new Date();

  userObject.Totalexpense = +totalExpense;
  setUserLocalStorage();
  setExpenseLocalStorage();
});

// FILTER/SEARCH EXPENSE
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", function (e) {
  expenseList.innerHTML = "";
  let searchInputValue = searchInput.value;
  let inputLength = searchInputValue.length;
  expenseArr.forEach((item) => {
    if (
      item.Title.toLowerCase().slice(0, inputLength) ==
      searchInputValue.toLowerCase()
    ) {
      expenseList.insertAdjacentHTML(
        "afterbegin",
        displayHtmlExpenseItem(item)
      );
    }
  });
});

/////////////// SORT EXPENSE ACCORDING TO CHOSEN TIMEFRAME ////////////
const yearButton = document.querySelector(".year");
const monthButton = document.querySelector(".month");
const weekButton = document.querySelector(".week");

yearButton.addEventListener("click", function (e) {
  e.preventDefault();
  expenseList.innerHTML = "";
  const currentYear = new Date().getFullYear();
  expenseArr.forEach((item) => {
    if (currentYear == new Date(item.date).getFullYear()) {
      expenseList.insertAdjacentHTML(
        "afterbegin",
        displayHtmlExpenseItem(item)
      );
    }
  });
});

monthButton.addEventListener("click", function (e) {
  e.preventDefault();
  expenseList.innerHTML = "";
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  expenseArr.forEach((item) => {
    if (
      currentYear == new Date(item.date).getFullYear() &&
      currentMonth == new Date(item.date).getMonth()
    ) {
      expenseList.insertAdjacentHTML(
        "afterbegin",
        displayHtmlExpenseItem(item)
      );
    }
  });
});

const currDate = new Date();
const first = currDate.getDate() - currDate.getDay();

const weekArr = [];
const firstDay = new Date(currDate.setDate(first));
weekArr.push(
  firstDay.toLocaleDateString("en-us", {
    year: "numeric",
    day: "numeric",
    month: "long",
  })
);

for (let i = 1; i < 7; i++) {
  let otherDays = new Date(
    currDate.setDate(firstDay.getDate() + i)
  ).toLocaleDateString("en-us", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
  weekArr.push(otherDays);
}

weekButton.addEventListener("click", function (e) {
  expenseList.innerHTML = "";
  e.preventDefault();
  expenseArr.forEach((item) => {
    if (weekArr.includes(item.date)) {
      expenseList.insertAdjacentHTML(
        "afterbegin",
        displayHtmlExpenseItem(item)
      );
    }
  });
});

////////////// Edit and DELETE expense //////////////////

let activeId = 0;

const editExpenseAmount = document.querySelector("#edit-expense-amount");
const editExpenseTitle = document.querySelector("#edit-expense-title");
const editExpenseDate = document.querySelector("#edit-expense-date");

expenseList.addEventListener("click", (e) => {
  e.preventDefault();
  let targetEl = e.target;

  if (targetEl.classList.contains("fa-pen-to-square")) {
    editExpenseModal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const parentContainer = e.target.closest(".expense-container");
    activeId = Number(parentContainer.getAttribute("id"));

    const lastChildEl = parentContainer.lastElementChild;
    const modifyExpenseValue = +lastChildEl
      .querySelector(".expense-item__Amount")
      .textContent.slice(1);

    editExpenseAmount.value = modifyExpenseValue;
    editExpenseTitle.value = lastChildEl.querySelector(
      ".expense-item__Title"
    ).textContent;

    editExpenseDate.valueAsDate = new Date(
      lastChildEl.querySelector(".expense-item__date").textContent
    );
  }

  if (targetEl.classList.contains("fa-trash-can")) {
    const parentContainer = e.target.closest(".expense-container");
    openDeleteModal();
    activeId = Number(parentContainer.getAttribute("id"));
  }
});

/////////////DELETE ICON//////////
const deleteExpense = document.querySelector(".continue-btn");
deleteExpense.addEventListener("click", function (e) {
  e.preventDefault();

  const removeAmount = expenseArr.find((el) => el.id == activeId).Amount;
  totalExpense -= Number(removeAmount);
  const removeIndex = expenseArr.findIndex((el) => el.id == activeId);
  expenseArr.splice(removeIndex, 1);
  updateBudgetSummary();
  expenseValue.textContent = `${formatter.format(totalExpense)}`;

  closeDeleteModal();
  displayExpenseList();

  userObject.Totalexpense = +totalExpense;
  setUserLocalStorage();
  setExpenseLocalStorage();
});

/////////////// EDIT EXPENSE MODAL ////////////
const editExpenseForm = document.querySelector(".edit-expense-form");
editExpenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const removeAmount = expenseArr.find((el) => el.id == activeId).Amount;

  totalExpense = totalExpense - removeAmount;
  const removeIndex = expenseArr.findIndex((el) => el.id == activeId);

  expenseArr.splice(removeIndex, 1);

  const editExpenseAmountValue = +editExpenseAmount.value;
  const editExpenseTitleValue = editExpenseTitle.value;

  totalExpense += editExpenseAmountValue;

  const editExpenseDateValue = new Date(
    editExpenseDate.value
  ).toLocaleDateString("en-us", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
  const timeStamp = Math.floor(Math.random() * 100) + `${Date.now()}`.slice(-4);

  let expenseItem = {
    Title: editExpenseTitleValue,
    Amount: editExpenseAmountValue,
    date: editExpenseDateValue,
    id: `${timeStamp}`,
  };

  expenseArr.unshift(expenseItem);

  updateBudgetSummary();
  expenseValue.textContent = `${formatter.format(totalExpense)}`;
  displayExpenseList();
  closeEditExpenseModal();

  userObject.Totalexpense = +totalExpense;
  setUserLocalStorage();
  setExpenseLocalStorage();
});
