
"use strict";

// =========================================
// SUPABASE CONNECTION
// =========================================

const SUPABASE_URL =
    "https://eotcdqdklcntiwlwxsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_A9UYGqRAxMObZyfRA5muxQ_EMT1Sk9j";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================================
// EMAILJS CONNECTION
// =========================================

const EMAILJS_PUBLIC_KEY = "6v5oAMiYCd9zMOmHL";
const EMAILJS_SERVICE_ID = "service_gn7zu9n";
const EMAILJS_TEMPLATE_ID = "template_wu13s7z";

if (window.emailjs) {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
} else {
    console.error("EmailJS failed to load.");
}


// =========================================
// CHECK ADMIN LOGIN
// =========================================

const loggedInAdmin = sessionStorage.getItem("phaiAdmin");

if (!loggedInAdmin) {
    window.location.href = "admin-login.html";
}


// =========================================
// DISPLAY ADMIN NAME
// =========================================

const adminName = document.getElementById("adminName");

const adminNames = {
    "salmawaleed": "Salma Waleed",
    "nouranahmed": "Nouran Ahmed",
    "hana": "Hana"
};

if (adminName && adminNames[loggedInAdmin]) {
    adminName.textContent = adminNames[loggedInAdmin];
}


// =========================================
// ELEMENTS
// =========================================

const userList = document.getElementById("userList");
const totalUsers = document.getElementById("totalUsers");
const feedbackSent = document.getElementById("feedbackSent");
const feedbackPending = document.getElementById("feedbackPending");

const noSelection = document.getElementById("noSelection");
const feedbackContent = document.getElementById("feedbackContent");

const selectedName = document.getElementById("selectedName");
const selectedEmail = document.getElementById("selectedEmail");
const selectedPosition = document.getElementById("selectedPosition");
const selectedCommittee = document.getElementById("selectedCommittee");
const selectedStatus = document.getElementById("selectedStatus");

const avatar = document.getElementById("avatar");
const feedbackText = document.getElementById("feedbackText");
const sendButton = document.getElementById("sendButton");
const successMessage = document.getElementById("successMessage");

let users = [];
let selectedUserIndex = null;


// =========================================
// GET USERS FROM SUPABASE
// =========================================

async function loadUsers() {
    try {
        const { data, error } = await supabaseClient
            .from("feedback_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);

            alert(
                "Unable to load members. Please check the browser Console."
            );

            return;
        }

        users = data || [];
        renderUsers();

    } catch (error) {
        console.error("Unexpected error loading members:", error);
        alert("Something went wrong while loading members.");
    }
}


// =========================================
// FEEDBACK STATUS HELPERS
// =========================================

function isFeedbackSent(user) {
    return user.feedback_sent === true ||
        user.feedback_sent === "true";
}

function formatFeedbackDate(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}


// =========================================
// DISPLAY STATISTICS
// =========================================

function updateStatistics() {
    const sent = users.filter(user => isFeedbackSent(user)).length;

    if (totalUsers) {
        totalUsers.textContent = users.length;
    }

    if (feedbackSent) {
        feedbackSent.textContent = sent;
    }

    if (feedbackPending) {
        feedbackPending.textContent = users.length - sent;
    }
}


// =========================================
// DISPLAY USERS
// =========================================

function renderUsers() {
    if (!userList) return;

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
        const item = document.createElement("div");
        item.className = "user-item";

        if (index === selectedUserIndex) {
            item.classList.add("active");
        }

        const nameRow = document.createElement("div");
        nameRow.style.display = "flex";
        nameRow.style.alignItems = "center";
        nameRow.style.justifyContent = "space-between";
        nameRow.style.gap = "10px";

        const name = document.createElement("div");
        name.className = "user-name";
        name.textContent = user.full_name || "Unnamed member";

        const sent = isFeedbackSent(user);

        const status = document.createElement("span");
        status.textContent = sent ? "Sent" : "Pending";
        status.style.flexShrink = "0";
        status.style.fontSize = "11px";
        status.style.fontWeight = "700";
        status.style.padding = "4px 8px";
        status.style.borderRadius = "20px";
        status.style.background = sent ? "#E2EBE4" : "#F3F0E7";
        status.style.color = sent ? "#526B5A" : "#806B35";

        nameRow.appendChild(name);
        nameRow.appendChild(status);

        const meta = document.createElement("div");
        meta.className = "user-meta";
        meta.textContent =
            `${user.position || ""} · ${user.committee || ""}`;

        item.appendChild(nameRow);
        item.appendChild(meta);

        if (sent && user.feedback_date) {
            const date = document.createElement("div");
            date.className = "user-meta";
            date.style.marginTop = "4px";
            date.textContent =
                `Feedback sent: ${formatFeedbackDate(user.feedback_date)}`;

            item.appendChild(date);
        }

        item.addEventListener("click", function () {
            selectUser(index);
        });

        userList.appendChild(item);
    });

    updateStatistics();
}


// =========================================
// SELECT USER
// =========================================

function selectUser(index) {
    selectedUserIndex = index;

    const user = users[index];

    if (!user) return;

    document.querySelectorAll(".user-item").forEach(item => {
        item.classList.remove("active");
    });

    const selectedItem =
        document.querySelectorAll(".user-item")[index];

    if (selectedItem) {
        selectedItem.classList.add("active");
    }

    noSelection.style.display = "none";
    feedbackContent.style.display = "block";

    selectedName.textContent = user.full_name || "";
    selectedEmail.textContent = user.email || "";
    selectedPosition.textContent = user.position || "";
    selectedCommittee.textContent = user.committee || "";

    selectedStatus.textContent = isFeedbackSent(user)
        ? `Sent${user.feedback_date
            ? " · " + formatFeedbackDate(user.feedback_date)
            : ""}`
        : "Pending";

    avatar.textContent = getInitials(user.full_name || "");
    feedbackText.value = user.feedback || "";

    successMessage.style.display = "none";

    sendButton.disabled = isFeedbackSent(user);

    sendButton.textContent = isFeedbackSent(user)
        ? "Feedback Already Sent"
        : "Send Feedback";
}


// =========================================
// INITIALS
// =========================================

function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


// =========================================
// SEND EMAIL AND SAVE FEEDBACK
// =========================================

sendButton.addEventListener("click", async function () {
    if (selectedUserIndex === null) {
        alert("Please select a member first.");
        return;
    }

    const user = users[selectedUserIndex];

    if (!user) {
        alert("The selected member could not be found.");
        return;
    }

    if (isFeedbackSent(user)) {
        alert("Feedback has already been marked as sent for this member.");
        return;
    }

    const feedback = feedbackText.value.trim();

    if (!feedback) {
        alert("Please write feedback before sending.");
        return;
    }

    if (!user.email) {
        alert("This member does not have an email address.");
        return;
    }

    if (!window.emailjs) {
        alert("EmailJS did not load. Please refresh and try again.");
        return;
    }

    sendButton.disabled = true;
    sendButton.textContent = "Sending email...";
    successMessage.style.display = "none";

    let emailSent = false;

    try {
        // 1. Send the email.
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: user.email,
                to_name: user.full_name,
                feedback: feedback
            }
        );

        emailSent = true;

        // 2. Save the sent status in Supabase.
        sendButton.textContent = "Saving status...";

        const feedbackDate = new Date().toISOString();

        const {
            data: savedRows,
            error
        } = await supabaseClient
            .from("feedback_requests")
            .update({
                feedback: feedback,
                feedback_sent: true,
                feedback_date: feedbackDate
            })
            .eq("id", user.id)
            .select("id, feedback, feedback_sent, feedback_date");

        if (error) {
            console.error("Supabase update error:", error);

            alert(
                "The email was sent, but Supabase could not save the sent status. " +
                "Check the database before trying again to avoid sending a duplicate email."
            );

            return;
        }

        if (!savedRows || savedRows.length === 0) {
            console.error(
                "Supabase updated no rows for feedback request id:",
                user.id
            );

            alert(
                "The email was sent, but the dashboard could not confirm that the sent status " +
                "was saved. Check this member's row in Supabase before sending again. " +
                "The UPDATE policy may need to be checked."
            );

            return;
        }

        // 3. Update the dashboard only after Supabase confirms the save.
        user.feedback = savedRows[0].feedback;
        user.feedback_sent = savedRows[0].feedback_sent;
        user.feedback_date = savedRows[0].feedback_date;

        renderUsers();
        selectUser(selectedUserIndex);

        successMessage.textContent = "Feedback email sent successfully!";
        successMessage.style.display = "block";

    } catch (error) {
        console.error(
            emailSent
                ? "Error after sending email:"
                : "EmailJS sending error:",
            error
        );

        if (!emailSent) {
            alert(
                "The email could not be sent. Check your EmailJS " +
                "template settings, service, and browser Console. " +
                "The feedback has not been marked as sent."
            );
        } else {
            alert(
                "The email was sent, but an unexpected error occurred " +
                "after sending. Check Supabase before retrying."
            );
        }

    } finally {
        const currentUser = users[selectedUserIndex];

        if (currentUser && isFeedbackSent(currentUser)) {
            sendButton.disabled = true;
            sendButton.textContent = "Feedback Already Sent";
        } else if (emailSent) {
            sendButton.disabled = true;
            sendButton.textContent = "Email Sent — Verify Status";
        } else {
            sendButton.disabled = false;
            sendButton.textContent = "Send Feedback";
        }
    }
});


// =========================================
// LOGOUT
// =========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("phaiAdmin");
        window.location.href = "admin-login.html";
    });
}


// =========================================
// START
// =========================================

loadUsers();
