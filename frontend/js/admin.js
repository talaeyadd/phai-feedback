// =========================================
// SUPABASE CONNECTION
// =========================================

const SUPABASE_URL =
    "https://eotcdqdklcntiwlwxsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_A9UYGqRAxMObZyfRA5muxQ_EMT1Sk9j";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// CHECK ADMIN LOGIN
// =========================================

const loggedInAdmin =
    sessionStorage.getItem("phaiAdmin");

if (!loggedInAdmin) {

    window.location.href =
        "admin-login.html";

}


// =========================================
// DISPLAY ADMIN NAME
// =========================================

const adminName =
    document.getElementById("adminName");

const adminNames = {

    "salmawaleed": "Salma Waleed",

    "nouranahmed": "Nouran Ahmed",

    "hana": "Hana"

};

if (
    adminName &&
    adminNames[loggedInAdmin]
) {

    adminName.textContent =
        adminNames[loggedInAdmin];

}


// =========================================
// ELEMENTS
// =========================================

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


let users = [];

let selectedUserIndex = null;


// =========================================
// GET USERS FROM SUPABASE
// =========================================

async function loadUsers() {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("feedback_requests")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Supabase error:",
                error
            );

            alert(
                "Unable to load members. Please check the Console."
            );

            return;

        }


        users = data || [];


        renderUsers();


    } catch (error) {

        console.error(
            "Unexpected error:",
            error
        );

    }

}


// =========================================
// DISPLAY STATISTICS
// =========================================

function updateStatistics() {

    const sent =
        users.filter(
            user =>
                user.feedback_sent === true
        ).length;


    totalUsers.textContent =
        users.length;


    feedbackSent.textContent =
        sent;


    feedbackPending.textContent =
        users.length - sent;

}


// =========================================
// DISPLAY USERS
// =========================================

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


    users.forEach(
        (user, index) => {

            const item =
                document.createElement("div");


            item.className =
                "user-item";


            item.innerHTML = `

                <div class="user-name">
                    ${user.full_name}
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

        }
    );


    updateStatistics();

}


// =========================================
// SELECT USER
// =========================================

function selectUser(index) {

    selectedUserIndex = index;


    const user =
        users[index];


    document
        .querySelectorAll(".user-item")
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    const selectedItem =
        document
            .querySelectorAll(".user-item")
            [index];


    if (selectedItem) {

        selectedItem.classList.add(
            "active"
        );

    }


    noSelection.style.display =
        "none";


    feedbackContent.style.display =
        "block";


    selectedName.textContent =
        user.full_name;


    selectedEmail.textContent =
        user.email;


    selectedPosition.textContent =
        user.position;


    selectedCommittee.textContent =
        user.committee;


    selectedStatus.textContent =
        user.feedback_sent
            ? "Sent"
            : "Pending";


    avatar.textContent =
        getInitials(
            user.full_name
        );


    feedbackText.value =
        user.feedback || "";


    successMessage.style.display =
        "none";

}


// =========================================
// INITIALS
// =========================================

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


// =========================================
// SAVE FEEDBACK
// =========================================

sendButton.addEventListener(
    "click",
    async function () {

        if (
            selectedUserIndex === null
        ) {

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


        sendButton.disabled = true;

        sendButton.textContent =
            "Saving...";


        try {

            const {
                error
            } = await supabaseClient
                .from("feedback_requests")
                .update({

                    feedback:
                        feedback,

                    feedback_sent:
                        true,

                    feedback_date:
                        new Date().toISOString()

                })
                .eq(
                    "id",
                    user.id
                );


            if (error) {

                console.error(
                    "Supabase error:",
                    error
                );

                alert(
                    "Unable to save the feedback."
                );

                return;

            }


            // Update local page data

            user.feedback =
                feedback;


            user.feedback_sent =
                true;


            user.feedback_date =
                new Date().toISOString();


            selectedStatus.textContent =
                "Sent";


            successMessage.style.display =
                "block";


            updateStatistics();


        } catch (error) {

            console.error(
                "Unexpected error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );


        } finally {

            sendButton.disabled = false;

            sendButton.textContent =
                "Send Feedback";

        }

    }
);


// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "phaiAdmin"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// =========================================
// START
// =========================================

loadUsers();