/* =========================================
   CHECK ADMIN LOGIN
========================================= */

const loggedInAdmin =
    sessionStorage.getItem("phaiAdmin");


if (!loggedInAdmin) {

    window.location.href =
        "admin-login.html";

}


/* =========================================
   DISPLAY ADMIN NAME
========================================= */

const adminName =
    document.getElementById("adminName");


const adminNames = {

    "salmawaleed": "Salma Waleed",

    "nouranahmed": "Nouran Ahmed",

    "hana": "Hana"

};


if (adminNames[loggedInAdmin]) {

    adminName.textContent =
        adminNames[loggedInAdmin];

}


/* =========================================
   GET REGISTERED USERS
========================================= */

let users =
    JSON.parse(
        localStorage.getItem("phaiUsers")
    ) || [];


/* =========================================
   ELEMENTS
========================================= */

const userList =
    document.getElementById("userList");

const totalUsers =
    document.getElementById("totalUsers");

const feedbackSent =
    document.getElementById("feedbackSent");

const feedbackPending =
    document.getElementById("feedbackPending");


const noSelection =
    document.getElementById("noSelection");

const feedbackContent =
    document.getElementById("feedbackContent");


const selectedName =
    document.getElementById("selectedName");

const selectedEmail =
    document.getElementById("selectedEmail");

const selectedPosition =
    document.getElementById("selectedPosition");

const selectedCommittee =
    document.getElementById("selectedCommittee");

const selectedStatus =
    document.getElementById("selectedStatus");

const avatar =
    document.getElementById("avatar");

const feedbackText =
    document.getElementById("feedbackText");

const sendButton =
    document.getElementById("sendButton");

const successMessage =
    document.getElementById("successMessage");


let selectedUserIndex = null;


/* =========================================
   DISPLAY STATISTICS
========================================= */

function updateStatistics() {

    const sent =
        users.filter(
            user => user.feedbackSent === true
        ).length;


    totalUsers.textContent =
        users.length;


    feedbackSent.textContent =
        sent;


    feedbackPending.textContent =
        users.length - sent;

}


/* =========================================
   DISPLAY USERS
========================================= */

function renderUsers() {

    userList.innerHTML = "";


    if (users.length === 0) {

        userList.innerHTML = `

            <div class="empty-state">

                <div style="font-size:30px; margin-bottom:12px;">
                    📋
                </div>

                No members have registered yet.

            </div>

        `;

        updateStatistics();

        return;

    }


    users.forEach((user, index) => {


        const item =
            document.createElement("div");


        item.className =
            "user-item";


        item.innerHTML = `

            <div class="user-name">
                ${user.fullName}
            </div>

            <div class="user-meta">
                ${user.position} · ${user.committee}
            </div>

        `;


        item.addEventListener(
            "click",
            function () {

                selectUser(index);

            }
        );


        userList.appendChild(item);

    });


    updateStatistics();

}


/* =========================================
   SELECT USER
========================================= */

function selectUser(index) {

    selectedUserIndex = index;


    const user =
        users[index];


    document
        .querySelectorAll(".user-item")
        .forEach(
            item =>
                item.classList.remove("active")
        );


    document
        .querySelectorAll(".user-item")[index]
        .classList.add("active");


    noSelection.style.display =
        "none";


    feedbackContent.style.display =
        "block";


    selectedName.textContent =
        user.fullName;


    selectedEmail.textContent =
        user.email;


    selectedPosition.textContent =
        user.position;


    selectedCommittee.textContent =
        user.committee;


    selectedStatus.textContent =
        user.feedbackSent
            ? "Sent"
            : "Pending";


    avatar.textContent =
        getInitials(user.fullName);


    feedbackText.value =
        user.feedback || "";


    successMessage.style.display =
        "none";

}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    return name
        .split(" ")
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


/* =========================================
   SEND FEEDBACK
========================================= */

sendButton.addEventListener(
    "click",
    function () {


        if (selectedUserIndex === null) {

            return;

        }


        const feedback =
            feedbackText.value.trim();


        if (feedback === "") {

            alert(
                "Please write feedback before sending."
            );

            return;

        }


        const user =
            users[selectedUserIndex];


        /*
            Save the feedback.

            Actual email sending will be connected
            later through the backend.
        */

        user.feedback =
            feedback;


        user.feedbackSent =
            true;


        user.feedbackDate =
            new Date().toISOString();


        localStorage.setItem(
            "phaiUsers",
            JSON.stringify(users)
        );


        selectedStatus.textContent =
            "Sent";


        successMessage.style.display =
            "block";


        updateStatistics();


        /*
            For now, the system records that the
            feedback was sent.

            Later we will connect this button
            to an actual email service.
        */

    }
);


/* =========================================
   LOGOUT
========================================= */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "phaiAdmin"
            );

            window.location.href =
                "admin-login.html";

        }
    );


/* =========================================
   START
========================================= */

renderUsers();