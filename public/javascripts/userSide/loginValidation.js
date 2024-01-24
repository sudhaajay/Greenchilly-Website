
function validation(event) {
    event.preventDefault(); // Prevent form submission
  
  
  
    emailChaking();
  
  
  
    passwordChaking();
  
  
  
    // Show all errors
  }
  
  
  function emailChaking() {
    let emailId = document.getElementById("email").value;
    let errorEmail = document.getElementById("erroremail");
  
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId)) {
      errorEmail.innerHTML = "Please enter valid email";
      return false;
    } else {
      errorEmail.innerHTML = "";
      return true;
    }
  }
  
  
  
  function passwordChaking() {
    let password = document.getElementById("password").value;
    let errorPassword = document.getElementById("errorpassword");
  
    if (password.trim() === "") {
      errorPassword.innerHTML = "Please enter your password";
      return false;
    } else if (password.length < 8) {
      errorPassword.innerHTML = "Please enter a minimum of 8 characters";
      return false;
    } else {
      errorPassword.innerHTML = "";
      return true;
    }
  }
  
  