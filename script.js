const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzkx85q7iGkEasHstvlvLtMyAiKfWrQc8-5ptt_rFWsX5vc9v9z5hnYIe1RG3jDsxpr/exec";


// =================================
// REPORT ISSUE
// =================================

document
    .getElementById("issueForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const category =
            document.getElementById("category").value;

        const location =
            document.getElementById("location").value;

        const description =
            document.getElementById("description").value;

        const result =
            document.getElementById("result");

        result.innerHTML = "Submitting...";


        const data = {

            type: "issue",

            category: category,

            location: location,

            description: description

        };


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(data)
                    }
                );


            const responseData =
                await response.json();


            if (responseData.success) {

                result.innerHTML = `
                    <div class="success-message">

                        ✅ Issue submitted successfully!

                        <br><br>

                        Issue ID:

                        <strong>
                            ${responseData.id}
                        </strong>

                    </div>
                `;

                document
                    .getElementById("issueForm")
                    .reset();

            } else {

                result.innerHTML =
                    "❌ Something went wrong.";

                console.error(
                    responseData.error
                );

            }

        }

        catch (error) {

            result.innerHTML =
                "❌ Unable to submit the issue.";

            console.error(error);

        }

    });



// =================================
// SHARE IDEA
// =================================

document
    .getElementById("ideaForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const category =
            document.getElementById("ideaCategory").value;

        const idea =
            document.getElementById("idea").value;

        const result =
            document.getElementById("ideaResult");


        result.innerHTML = "Submitting...";


        const data = {

            type: "idea",

            category: category,

            idea: idea

        };


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(data)
                    }
                );


            const responseData =
                await response.json();


            if (responseData.success) {

                result.innerHTML = `
                    <div class="success-message">

                        💡 Idea submitted successfully!

                        <br><br>

                        Idea ID:

                        <strong>
                            ${responseData.id}
                        </strong>

                    </div>
                `;


                document
                    .getElementById("ideaForm")
                    .reset();

            }

            else {

                result.innerHTML =
                    "❌ Something went wrong.";

                console.error(
                    responseData.error
                );

            }

        }

        catch (error) {

            result.innerHTML =
                "❌ Unable to submit the idea.";

            console.error(error);

        }

    });



// =================================
// ASK QUESTION
// =================================

document
    .getElementById("questionForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const question =
            document.getElementById("question").value;

        const result =
            document.getElementById("questionResult");


        result.innerHTML = "Submitting...";


        const data = {

            type: "question",

            question: question

        };


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(data)
                    }
                );


            const responseData =
                await response.json();


            if (responseData.success) {

                result.innerHTML = `
                    <div class="success-message">

                        ❓ Question submitted successfully!

                        <br><br>

                        Question ID:

                        <strong>
                            ${responseData.id}
                        </strong>

                    </div>
                `;


                document
                    .getElementById("questionForm")
                    .reset();

            }

            else {

                result.innerHTML =
                    "❌ Something went wrong.";

                console.error(
                    responseData.error
                );

            }

        }

        catch (error) {

            result.innerHTML =
                "❌ Unable to submit the question.";

            console.error(error);

        }

    });
    // =================================
// LOAD DASHBOARD
// =================================

async function loadDashboard() {

    try {

        const response =
            await fetch(SCRIPT_URL);

        const data =
            await response.json();


        if (data.success) {

            document.getElementById(
                "totalIssues"
            ).textContent = data.issues;


            document.getElementById(
                "resolvedIssues"
            ).textContent = data.resolved;


            document.getElementById(
                "totalIdeas"
            ).textContent = data.ideas;


            document.getElementById(
                "totalQuestions"
            ).textContent = data.questions;


            document.getElementById(
                "dashboardStatus"
            ).textContent =
                "Updated automatically from student submissions.";

        }

        else {

            document.getElementById(
                "dashboardStatus"
            ).textContent =
                "Unable to load dashboard.";

            console.error(data.error);

        }

    }

    catch (error) {

        document.getElementById(
            "dashboardStatus"
        ).textContent =
            "Unable to connect to dashboard.";

        console.error(error);

    }

}


// Load dashboard when page opens

loadDashboard();
// =================================
// ISSUE TRACKING
// =================================

document
    .getElementById("trackForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const issueId =
                document
                    .getElementById("issueId")
                    .value
                    .trim()
                    .toUpperCase();


            const result =
                document
                    .getElementById("trackResult");


            result.innerHTML =
                "🔎 Searching...";


            try {

                const response =
                    await fetch(
                        SCRIPT_URL +
                        "?id=" +
                        encodeURIComponent(issueId)
                    );


                const data =
                    await response.json();


                if (
                    data.success &&
                    data.found
                ) {

                    const issue =
                        data.issue;


                    result.innerHTML = `

                        <div class="issue-result">

                            <h3>
                                Issue ${issue.id}
                            </h3>


                            <p>
                                <strong>
                                    Category:
                                </strong>

                                ${issue.category}
                            </p>


                            <p>
                                <strong>
                                    Location:
                                </strong>

                                ${issue.location}
                            </p>


                            <p>
                                <strong>
                                    Problem:
                                </strong>

                                ${issue.description}
                            </p>


                            <div class="status-box">

                                <strong>
                                    Status:
                                </strong>

                                <span>
                                    ${issue.status}
                                </span>

                            </div>

                        </div>

                    `;

                }

                else {

                    result.innerHTML = `

                        <div class="not-found">

                            ❌ Issue ID not found.

                            <br>

                            Please check the ID
                            and try again.

                        </div>

                    `;

                }

            }

            catch (error) {

                result.innerHTML =
                    "❌ Unable to check issue status.";

                console.error(error);

            }

        });