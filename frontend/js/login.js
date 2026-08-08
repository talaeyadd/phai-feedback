const loginForm = document.getElementById("loginForm");

const errorMessage = document.getElementById("errorMessage");


/*
    Authorized PhAI administrators

    All administrators currently use:
    Password: 123456
*/

const admins = {

    "salmawaleed": "123456",

    "nouranahmed": "123456",

    "hana": "123456"

};


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("password").value;


    if (
        admins[username] &&
        admins[username] === password
    ) {

        /*
            Remember that an administrator
            is currently logged in.
        */

        sessionStorage.setItem(
            "phaiAdmin",
            username
        );


        window.location.href =
            "admin.html";

    }

    else {

        errorMessage.style.display =
            "block";

    }

});