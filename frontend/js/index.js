// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://eotcdqdklcntiwlwxsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_A9UYGqRAxMObZyfRA5muxQ_EMT1Sk9j";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// FEEDBACK FORM
// ==========================================

const feedbackForm =
    document.getElementById("feedbackForm");


if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // GET FORM VALUES
            // ==================================

            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const position =
                document
                    .getElementById("position")
                    .value;


            const committee =
                document
                    .getElementById("committee")
                    .value;


            // ==================================
            // VALIDATE
            // ==================================

            if (
                !fullName ||
                !email ||
                !position ||
                !committee
            ) {

                alert(
                    "Please complete all fields."
                );

                return;
            }


            // ==================================
            // BUTTON
            // ==================================

            const submitButton =
                feedbackForm.querySelector(
                    "button[type='submit']"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                // ==================================
                // INSERT INTO SUPABASE
                // ==================================

                const { error } =
                    await supabaseClient
                        .from("feedback_requests")
                        .insert([
                            {
                                full_name: fullName,

                                email: email,

                                position: position,

                                committee: committee
                            }
                        ]);


                // ==================================
                // HANDLE SUPABASE ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Supabase error:",
                        error
                    );

                    alert(
                        "Something went wrong while submitting your request. Please try again."
                    );

                    return;
                }


                // ==================================
                // SUCCESS
                // ==================================

                console.log(
                    "Feedback request submitted successfully."
                );


                alert(
                    "Your feedback request has been submitted successfully!"
                );


                feedbackForm.reset();


            } catch (error) {

                console.error(
                    "FULL ERROR:",
                    error
                );

                console.error(
                    "Error message:",
                    error.message
                );

                console.error(
                    "Error name:",
                    error.name
                );


                alert(
                    "Something went wrong. Please check the Console."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Request Feedback";

                }

            }

        }
    );

}