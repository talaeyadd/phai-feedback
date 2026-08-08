const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const position = document.getElementById("position").value;
    const committee = document.getElementById("committee").value;


    // Make sure all information exists
    if (!fullName || !email || !position || !committee) {

        alert("Please complete all fields.");

        return;
    }


    // Create the new member
    const newUser = {

        id: Date.now(),

        fullName: fullName,

        email: email,

        position: position,

        committee: committee,

        feedback: "",

        feedbackSent: false,

        feedbackDate: null

    };


    // Get existing members
    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem("phaiUsers")
            ) || [];

    } catch (error) {

        users = [];

    }


    // Add new member
    users.push(newUser);


    // Save members
    localStorage.setItem(
        "phaiUsers",
        JSON.stringify(users)
    );


    // Confirmation
    alert(
        "Feedback request submitted successfully!"
    );


    // Clear form
    feedbackForm.reset();

});