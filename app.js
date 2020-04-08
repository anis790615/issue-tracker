class Issue {
  constructor(description, severity, assignee) {
    this.description = description;
    this.severity = severity;
    this.assignee = assignee;
    this.status = "open";
    this.id = uuidv4();
  }
}
class Store {
  fetchIssues() {
    let issues;
    if (localStorage.getItem("issues") === null) {
      issues = [];
    } else {
      issues = JSON.parse(localStorage.getItem("issues"));
    }
    return issues;
  }
  displayIssues(ui) {
    const issues = this.fetchIssues();
    document.querySelector("#issuesList").innerHTML = "";
    issues.forEach((issue) => ui.addIssue(issue));
  }
  storeIssue(issue) {
    const issues = this.fetchIssues();
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));
    this.displayIssues(ui);
  }
  removeIssue(issueId) {
    const issues = this.fetchIssues();
    issues.forEach(function (issue, index) {
      if (issueId === issue.id) {
        issues.splice(index, 1);
      }
    });
    localStorage.setItem("issues", JSON.stringify(issues));
    this.displayIssues(ui);
  }
  changeStatus(issueId) {
    const issues = this.fetchIssues();
    issues.forEach(function (issue) {
      if (issueId === issue.id) {
        issue.status = "closed";
      }
    });
    localStorage.setItem("issues", JSON.stringify(issues));
    store.displayIssues(ui);
  }
}
class UI {
  showAlert(message, statusClass) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert ${statusClass}`;
    alertDiv.innerText = message;
    const parentDiv = document.querySelector(".jumbotron");
    const beforeDiv = document.querySelector(".jumbotron>h3");
    parentDiv.insertBefore(alertDiv, beforeDiv);
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  clrFields() {
    document.querySelector("#issueDescriptionInput").value = "";
    document.querySelector("#issueSeverityInput").value = "";
    document.querySelector("#issueAssignInput").value = "";
  }
  addIssue(issue) {
    const listOfIssues = document.querySelector("#issuesList");
    const issueDiv = document.createElement("div");
    issueDiv.className = "card-body mb-3 bg-light";
    issueDiv.innerHTML = `<h6>Issue id:<span>${issue.id}</span></h6>
    <p><span class="badge badge-info">${issue.status}</span></p>
    <h3>${issue.description}</h3>
    <p>
      <span><i class="fas fa-clock"> </i> ${issue.severity}</span
      >&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
      <span><i class="fas fa-user"> </i> ${issue.assignee}</span>
    </p>
    <button id="closeIssue" class="btn btn-warning btn-sm">
      Close
    </button>
    <button id="deleteIssue" class="btn btn-danger btn-sm">
      Delete
    </button>`;
    listOfIssues.appendChild(issueDiv);
  }
}

const ui = new UI();
const store = new Store();
document.addEventListener("DOMContentLoaded", store.displayIssues(ui));
document
  .querySelector('.btn[type="submit"]')
  .addEventListener("click", function (e) {
    const issueDesc = document.querySelector("#issueDescriptionInput").value,
      issueSeverity = document.querySelector("#issueSeverityInput").value,
      issueAssignee = document.querySelector("#issueAssignInput").value,
      newIssue = new Issue(issueDesc, issueSeverity, issueAssignee);

    if (issueDesc === "" || issueSeverity === "" || issueAssignee === "") {
      ui.showAlert("Please fill all the fields", "error");
    } else {
      store.storeIssue(newIssue);
      ui.clrFields();
      ui.showAlert("Issue Added", "success");
    }
    e.preventDefault();
  });
document.querySelector("#issuesList").addEventListener("click", function (e) {
  if (e.target.id === "deleteIssue") {
    store.removeIssue(
      e.target.parentElement.firstChild.firstChild.nextSibling.textContent
    );
    ui.showAlert("Issue deleted", "success");
  } else if (e.target.id === "closeIssue") {
    store.changeStatus(
      e.target.parentElement.firstChild.firstChild.nextSibling.textContent
    );
    ui.showAlert("Issue closed", "success");
  }
});
