

//REGISTER SIDE VALIDATION
function validation(event) {
 
    if(nameChaking() && emailChaking() && numberChaking() && passwordChaking() ){
            document.getElementById("myForm").submit();                
        }
        else{
          nameChaking();

emailChaking();

numberChaking();

passwordChaking();
            return false;
        }




    // Show all errors
  }

  function nameChaking() {
    let name = document.getElementById("name").value;
    let errorName = document.getElementById("errorname");

    if (name.trim() === "") {
      errorName.innerHTML = "Please enter your name";
      return false;
    } else {
      errorName.innerHTML = "";
      return true;
    }
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

  function numberChaking() {
    let number = document.getElementById("number").value;
    let errorNumber = document.getElementById("errornumber");

    if (!/^[0-9]+$/.test(number)) {
      errorNumber.innerHTML = "Please enter a valid number";
      return false;
    } else if (number.length !== 10) {
      errorNumber.innerHTML = "Please enter 10 digits";
      return false;
    } else {
      errorNumber.innerHTML = "";
      return true;
    }
  }
  let password 
  function passwordChaking() {
     password = document.getElementById("password").value;
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
  function password2Chaking() {
    let cpassword = document.getElementById("cpassword").value;
    if (cpassword == "") {
      document.getElementById("errorcpassword").innerHTML =
        "please enter your password";
      return false;
    } else if (cpassword != password) {
      document.getElementById("errorcpassword").innerHTML =
        "Password not match";
      return false;
    } else {
      document.getElementById("errorcpassword").innerHTML = "";
      return true;
    }
  }