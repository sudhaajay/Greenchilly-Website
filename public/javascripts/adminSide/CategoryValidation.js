// add Category---------------

document.addEventListener('DOMContentLoaded', function() {
        const categoryImageInput = document.getElementById('category_image');
        const categoryImagePreview = document.getElementById('category_image_preview');

        categoryImageInput.addEventListener('change', function() {
            displayCategoryImage(this, categoryImagePreview);
            });
        });

        function displayCategoryImage(input, preview) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = '/uploadimage.svg';
            }
        }
    
    
    
            document.addEventListener('DOMContentLoaded', function () {
                const category_name = document.getElementById("category_name");
                const category_name_error = document.getElementById("category_name-error");
                const description = document.getElementById("description");
                const description_error = document.getElementById("description-error");
      
    
                category_name.addEventListener('input', function () {
                    category_name_error.innerHTML = category_name.value.trim() === "" ? "Please enter category name" : "";
                });
    
                description.addEventListener('input', function () {
                    description_error.innerHTML = description.value.trim() === "" ? "Please enter category description" : "";
                });
    
           
            });
    
            function validationChecking() {
    const category_name = document.getElementById("category_name").value;
    const description = document.getElementById("description").value;
    const category_image = document.getElementById("category_image").files[0]; // Get the uploaded file

    const category_name_error = document.getElementById("category_name-error");
    const description_error = document.getElementById("description-error");
    const category_image_error = document.getElementById("category_image-error");

    category_name_error.innerHTML = category_name.trim() === "" ? "Please enter category name" : "";
    description_error.innerHTML = description.trim() === "" ? "Please enter category description" : "";

    if (!category_image) {
        category_image_error.innerHTML = "Please upload an image";
        return false; // Prevent form submission if no image is uploaded
    } else {
        const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",

];// Add more types if needed
        if (!allowedTypes.includes(category_image.type)) {
            category_image_error.innerHTML = "Please upload a valid image file (JPEG, PNG, GIF)";
            return false; // Prevent form submission if the file type is not allowed
        } else {
            category_image_error.innerHTML = ""; // Clear any previous error messages
            return true; // Proceed with form submission
        }
    }
}

// category------------------------

           
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const table = document.getElementById("category");
    const rows = table.getElementsByTagName("tr");
    
    searchInput.addEventListener("keyup", function () {
    const searchText = searchInput.value.toLowerCase();
    
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].textContent.toLowerCase();
      if (rowData.includes(searchText)) {
          rows[i].style.display = "";
      } else {
          rows[i].style.display = "none";
      }
    }
    });
    });
            
    function ProductUnlist(productId) {
          Swal.fire({
            title: "Are you sure?",
            text: "Please confirm to block this product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              // Perform the deletion via AJAX/fetch to the server
              fetch(`/admin/unlistCategory?id=${productId}`, {
                method: 'GET',
                // Add other necessary headers or configurations
              }).then(response => {
                if (response.ok) {
                  // Product successfully deleted
                  Swal.fire({
                    title: "success",
                    text: "Please confirm to unblock this product!",
                    icon: "success",
                    timer: 2000,
                    timeProgressBar: true,
                    showConfirmButton: false,
    
    
                  })
                    .then(() => {
                      // Redirect after displaying the success message
                      window.location.href = '/admin/category'; // Redirect to a suitable page
                    });
                } else {
                  Swal.fire("Error!", "Failed to delete product", "error");
                }
              }).catch(error => {
                Swal.fire("Error!", "Failed to delete product", "error");
              });
            }
          });
        }  

// Edit category---------------------------



document.addEventListener('DOMContentLoaded', function() {
            const categoryImageInput = document.getElementById('category_image');
            const categoryImagePreview = document.getElementById('category_image_preview');

            categoryImageInput.addEventListener('change', function() {
                displayCategoryImage(this, categoryImagePreview);
            });
        });

        function displayCategoryImage(input, preview) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = '/category/<%= category.image %>';
            }
        }



        document.addEventListener('DOMContentLoaded', function() {
        const categoryImageInput = document.getElementById('category_image');
        const categoryImagePreview = document.getElementById('category_image_preview');

        categoryImageInput.addEventListener('change', function() {
            displayCategoryImage(this, categoryImagePreview);
            });
        });

        function displayCategoryImage(input, preview) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = '/uploadimage.svg';
            }
        }
    
    
    
            document.addEventListener('DOMContentLoaded', function () {
                const category_name = document.getElementById("category_name");
                const category_name_error = document.getElementById("category_name-error");
                const description = document.getElementById("description");
                const description_error = document.getElementById("description-error");
      
    
                category_name.addEventListener('input', function () {
                    category_name_error.innerHTML = category_name.value.trim() === "" ? "Please enter category name" : "";
                });
    
                description.addEventListener('input', function () {
                    description_error.innerHTML = description.value.trim() === "" ? "Please enter category description" : "";
                });
    
           
            });
    
            function validationChecking() {
    const category_name = document.getElementById("category_name").value;
    const description = document.getElementById("description").value;
    const category_image = document.getElementById("category_image"); // Get the uploaded file

    const category_name_error = document.getElementById("category_name-error");
    const description_error = document.getElementById("description-error");
    const category_image_error = document.getElementById("category_image-error");

    category_name_error.innerHTML = category_name.trim() === "" ? "Please enter category name" : "";
    description_error.innerHTML = description.trim() === "" ? "Please enter category description" : "";

    const uploadedFile = category_image.files[0];
    const existingImage = document.getElementById("category_image_preview");
    const defaultImageSrc = existingImage.getAttribute("src");
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp"
    ];

    if (category_name.trim() === "" || description.trim() === "") {
        return false; // Prevent form submission if fields are empty
    }

    if (uploadedFile) {
        if (!allowedTypes.includes(uploadedFile.type)) {
            category_image_error.innerHTML = "Please upload a valid image file (JPEG, PNG, GIF)";
            return false; // Prevent form submission if invalid file type
        }
    } else {
        // If no new file is selected, maintain the existing image
        existingImage.setAttribute("src", defaultImageSrc);
    }

    return true; // Allow form submission if all validations pass
}


 





