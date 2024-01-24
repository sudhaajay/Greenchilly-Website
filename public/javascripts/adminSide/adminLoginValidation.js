

function emailChaking() {
  let emailId = document.getElementById("email").value;
  console.log("emailId" + emailId);
  if (
    /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId) == false
  ) {
    console.log("emailIddd" + emailId);
    document.getElementById("erroremail").innerHTML =
      "Please enter valid email ";
    return false;
  } else {
    document.getElementById("erroremail").innerHTML = "";
    return true;
  }
}

let password = document.getElementById("password").value;
function passwordChaking() {
  password = document.getElementById("password").value;
  if (password == "") {
    document.getElementById("errorpassword").innerHTML =
      "please enter your password";
    return false;
  } else if (password.length < 8) {
    document.getElementById("errorpassword").innerHTML =
      "please enter minimum 8 digits";
    return false;
  } else {
    document.getElementById("errorpassword").innerHTML = "";
    return true;
  }
}

