

function validateNameForm() {
    var newName = document.forms["nameForm"]["fname"].value;
    if (newName == null || newName === "") {
        document.forms["nameForm"]["fname"].style.borderColor = "red";
        document.getElementById('feedback').innerHTML = "*Please fill in"
        return false;
    }
    document.getElementById("welcome").innerHTML = "Welcome " + newName + "!";
    document.forms["nameForm"].style.display = "none";
    return false;
}

// showing comment box after ticking

function showExtraFields() {
    const extraFieldset = document.getElementById('extraFields');
    const checkBox = document.getElementById('comment');

    if (checkBox && checkBox.checked) {
        extraFieldset.style.display ="block";
    } 
    else {
        extraFieldset.style.display = "none";
    }
    
}


document.addEventListener('DOMContentLoaded', function() {
    let totalHours = 0; 
    let studyData = JSON.parse(localStorage.getItem('studyData')) || [];  

    //clearing data from local store and page

    document.querySelector('.cleardata button').addEventListener('click', clearData);

    function clearData() {
        localStorage.removeItem('studyData');
        studyData = [];
        totalHours = 0;
        
        document.getElementById('sessionList').innerHTML = '';
        document.getElementById('totalHours').textContent = "0 hour(s)";
        // Clear the subject summary
        updateSummary();
    }
    


    function saveData() {
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const duration = parseFloat(document.getElementById('duration').value);
        const subject = document.getElementById('subject').value;
        const description = document.getElementById('description').value;



        const studySession = {
            date,
            time,
            duration,
            subject,
            description: description || null,
        };


        studyData.push(studySession);
        totalHours += duration;

        localStorage.setItem('studyData', JSON.stringify(studyData))

        updateStudySessions();
        updateSummary();
    

        // Clear input fields
        document.getElementById('date').value = '';
        document.getElementById('time').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('description').value = '';
    }


    // loads saved data from local storage and updates summary and study sessions
    function loadSavedData() {
        totalHours = 0;
        studyData.forEach(session => {
            totalHours += session.duration;
        });
        updateStudySessions();
        updateSummary();
    }


    function updateStudySessions() {
        const sessionList = document.getElementById('sessionList');
        sessionList.innerHTML = '';

        studyData.forEach((session) => {
            const listItem = document.createElement('li');

            listItem.textContent = `${session.date} ${session.time} - ${session.duration}h - ${session.subject}`;

            if (session.description) {
                listItem.textContent += `: ${session.description}`;
            }

            sessionList.appendChild(listItem);
        });
    }

    function updateSummary() {
        document.getElementById('totalHours').textContent = totalHours + " hour(s)";

        const subjectSummary = {};
        studyData.forEach(session => {
            if (subjectSummary[session.subject]) {
                subjectSummary[session.subject] += session.duration;
            } else {
                subjectSummary[session.subject] = session.duration;
            }
        });

        const subjectSummaryDiv = document.getElementById('subjectSummary');
        subjectSummaryDiv.innerHTML = '';
        for (let subject in subjectSummary) {
            const summaryItem = document.createElement('p');
            summaryItem.textContent = `${subject}: ${subjectSummary[subject]}h`;
            subjectSummaryDiv.appendChild(summaryItem);
        }
    }
    

    document.getElementById('studyForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveData();
    });


    loadSavedData();
    

});
