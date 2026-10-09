
document.addEventListener("DOMContentLoaded", function () {
    // Get HTML elements
    const userNameInput = document.getElementById("userName");
    const computerNameInput = document.getElementById("computerName");
    const issueInput = document.getElementById("issue");
    const diagnoseButton = document.getElementById("diagnoseButton");
    const resultDiv = document.getElementById("result");

    const showTicketsButton = document.getElementById("showTicketsButton");
    const clearTicketsButton = document.getElementById("clearTicketsButton");
    const ticketCount = document.getElementById("ticketCount");
    const ticketList = document.getElementById("ticketList");

    // Troubleshooting guides
    const troubleshootingGuides = {
        internet: {
            title: "No Internet Connection",
            steps: [
                "Check that Wi-Fi is enabled or the network cable is connected.",
                "Check whether other devices can access the internet.",
                "Disconnect and reconnect to the network.",
                "Restart the computer and test the connection again.",
                "If the problem continues, contact IT support."
            ]
        },

        printer: {
            title: "Printer Not Working",
            steps: [
                "Check that the printer is powered on.",
                "Check the paper and ink or toner levels.",
                "Check the USB or network connection.",
                "Check the print queue for stuck jobs.",
                "Restart the printer and try printing again."
            ]
        },

        slow: {
            title: "Computer Running Slowly",
            steps: [
                "Restart the computer.",
                "Close unnecessary applications.",
                "Check the available disk space.",
                "Open Task Manager to check CPU and memory usage.",
                "Contact IT support if the computer remains slow."
            ]
        },

        password: {
            title: "Password Problem",
            steps: [
                "Check that Caps Lock is turned off.",
                "Verify that the correct username is being used.",
                "Follow the organization's approved password-reset process.",
                "Check whether the account is locked.",
                "Contact IT support if you still cannot sign in."
            ]
        },

        software: {
            title: "Software Problem",
            steps: [
                "Write down the software name and error message.",
                "Close and reopen the application.",
                "Restart the computer if appropriate.",
                "Check for approved software updates.",
                "Contact IT support if the problem persists."
            ]
        }
    };

    // Save support tickets in the browser
    let tickets = [];

    try {
        const savedTickets = JSON.parse(
            localStorage.getItem("supportTickets") || "[]"
        );

        tickets = Array.isArray(savedTickets) ? savedTickets : [];
    } catch (error) {
        tickets = [];
        console.error("Could not load saved tickets:", error);
    }

    // Display troubleshooting steps
    function diagnoseIssue() {
        const userName = userNameInput.value.trim();
        const computerName = computerNameInput.value.trim();
        const issue = issueInput.value;

        if (!userName || !computerName || !issue) {
            alert("Please complete all fields.");
            return;
        }

        const guide = troubleshootingGuides[issue];

        if (!guide) {
            alert("Please select a valid problem.");
            return;
        }

        resultDiv.replaceChildren();
        resultDiv.hidden = false;

        const heading = document.createElement("h3");
        heading.textContent = guide.title;
        resultDiv.appendChild(heading);

        const list = document.createElement("ol");

        guide.steps.forEach(function (step) {
            const item = document.createElement("li");
            item.textContent = step;
            list.appendChild(item);
        });

        resultDiv.appendChild(list);

        // Save the request as a support ticket
        const ticket = {
            userName: userName,
            computerName: computerName,
            issue: guide.title,
            date: new Date().toLocaleString()
        };

        tickets.push(ticket);
        saveTickets();
        displayTickets();
    }

    // Save tickets to local storage
    function saveTickets() {
        try {
            localStorage.setItem("supportTickets", JSON.stringify(tickets));
        } catch (error) {
            console.error("Could not save tickets:", error);
        }
    }

    // Show saved tickets
    function displayTickets() {
        ticketCount.textContent = tickets.length;
        ticketList.replaceChildren();

        if (tickets.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-message";
            message.textContent = "No saved support tickets.";
            ticketList.appendChild(message);
            return;
        }

        tickets.forEach(function (ticket, index) {
            const card = document.createElement("div");
            card.className = "ticket";

            const heading = document.createElement("h3");
            heading.textContent = "Ticket #" + (index + 1);
            card.appendChild(heading);

            const details = [
                "Name: " + ticket.userName,
                "Computer: " + ticket.computerName,
                "Issue: " + ticket.issue,
                "Date: " + ticket.date
            ];

            details.forEach(function (detail) {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });

            ticketList.appendChild(card);
        });
    }

    // Clear all saved tickets
    function clearTickets() {
        if (tickets.length === 0) {
            alert("There are no tickets to clear.");
            return;
        }

        if (confirm("Are you sure you want to clear all saved tickets?")) {
            tickets = [];
            saveTickets();
            displayTickets();
            alert("All tickets have been cleared.");
        }
    }

    // Connect buttons to their functions
    diagnoseButton.addEventListener("click", diagnoseIssue);
    showTicketsButton.addEventListener("click", displayTickets);
    clearTicketsButton.addEventListener("click", clearTickets);

    // Display saved tickets when the page opens
    displayTickets();

    console.log("IT Support Assistant JavaScript loaded successfully.");
});
