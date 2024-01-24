 


    document.addEventListener("DOMContentLoaded", function () {
      const searchInput = document.getElementById("searchInput");
      const table = document.getElementById("products");
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

// soft delete-------------------------
    function ProductUnlist(productId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Please confirm to delete this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform the deletion via AJAX/fetch to the server
          fetch(`/admin/deleteProduct/${productId}`, {
            method: 'GET',
            // Add other necessary headers or configurations
          }).then(response => {
            if (response.ok) {
              // Product successfully deleted
              Swal.fire({
                title: "success",
                text: "Please confirm to delete this product!",
                icon: "success",
                timer: 2000,
                timeProgressBar: true,
                showConfirmButton: false,


              })
                .then(() => {
                  // Redirect after displaying the success message
                  window.location.href = '/admin/products'; // Redirect to a suitable page
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

  

  
// product  visible--------------------
  function ProductVisible(productId) {
    Swal.fire({
      title: "Are you sure?",
      text: "Please confirm to make this product visible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make it visible!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the visibility update via AJAX/fetch to the server
        fetch(`/admin/visibleProduct/${productId}`, {
          method: 'GET',
          // Add other necessary headers or configurations
        }).then(response => {
          if (response.ok) {
            // Product visibility updated successfully
            Swal.fire({
              title: "success",
              text: "Product visibility updated successfully!",
              icon: "success",
              timer: 2000,
              timeProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              // Redirect after displaying the success message
              window.location.href = '/admin/products'; // Redirect to a suitable page
            });
          } else {
            Swal.fire("Error!", "Failed to update product visibility", "error");
          }
        }).catch(error => {
          Swal.fire("Error!", "Failed to update product visibility", "error");
        });
      }
    });
  }


//   ----------------ADD PRODUCT-----------------



       
function displayImage(imageNumber, input) {
    const preview = document.getElementById(`image-preview${imageNumber}`);

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '';
    }
}

// function removeSize(button) {
// const container = document.querySelector('.size-container');
// const sizeDiv = button.parentElement.parentElement; // Get the parent div containing the size and stock fields.
// container.removeChild(sizeDiv); // Remove the parent div from the container.
// }


function validationChecking() {
  alert('1');
const product_title = document.getElementById("product_title").value;
const product_brand = document.getElementById("product_brand").value;
const product_category = document.querySelector('select[name="category"]').value.trim();
const product_stock = document.getElementById("product_stock").value;
const product_price = document.getElementById("product_price").value;
const discount_price = document.getElementById("discount_price").value;
const description = document.getElementById("description").value;

const product_title_error = document.getElementById("product_title-error");
const product_brand_error = document.getElementById("product_brand-error");
const product_category_error = document.getElementById("product_category-error");
const product_stock_error = document.getElementById("product_stock-error");
const product_price_error = document.getElementById("product_price-error");
const discount_price_error = document.getElementById("discount_price-error");
const description_error = document.getElementById("description-error");

product_title_error.innerHTML = product_title.trim() === "" ? "Please enter product name" : "";
product_brand_error.innerHTML = product_brand.trim() === "" ? "Please enter product brand" : "";
product_category_error.innerHTML = product_category.trim() === "" ? "Please enter product category" : "";
product_stock_error.innerHTML = isNaN(product_stock) || product_stock.trim() === "" || parseFloat(product_stock) < 0 ? "Please enter a valid stock " : "";
product_price_error.innerHTML = isNaN(product_price) || product_price.trim() === "" || parseFloat(product_price) < 0 ? "Please enter a valid price " : "";
discount_price_error.innerHTML = isNaN(discount_price) || discount_price.trim() === "" || parseFloat(discount_price) < 0 ? "Please enter a valid discount price " : "";
description_error.innerHTML = description.trim() === "" ? "Please enter product description" : "";

return !(product_title_error.innerHTML !== "" || product_brand_error.innerHTML !== "" || product_category_error.innerHTML !== "" || product_stock_error.innerHTML !== "" || product_price_error.innerHTML !== "" || discount_price_error.innerHTML !== "" || description_error.innerHTML !== "");
}

// ---------------Edit product-----------------------




function displayImage(imageNumber, input) {
    const preview = document.getElementById(`image-preview${imageNumber}`);

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '';
    }
}

function viewImage(event, imageIndex) {
const imgView = document.getElementById(`imgView${imageIndex}`);
imgView.src = URL.createObjectURL(event.target.files[0]);
}








function validationChecking() {
  
const product_title = document.getElementById("product_title").value;
const brand = document.getElementById("brand").value;
const product_category = document.querySelector('select[name="category"]').value.trim();
const stock = document.getElementById("stock").value;
const product_price = document.getElementById("product_price").value;
const discount_price = document.getElementById("discount_price").value;
const description = document.getElementById("description").value;

const product_title_error = document.getElementById("product_title-error");
const product_brand_error = document.getElementById("product_brand-error");
const product_category_error = document.getElementById("product_category-error");
const stock_error = document.getElementById("product_stock-error");
const product_price_error= document.getElementById("product_price-error");
const discount_price_error = document.getElementById("product_discount_price-error");
const description_error = document.getElementById("product_description-error");





product_title_error.innerHTML = product_title.trim() === "" ? "Please enter product name" : "";
product_brand_error.innerHTML = product_brand.trim() === "" ? "Please enter product brand" : "";
product_category_error.innerHTML = product_category.trim() === "" ? "Please enter product category" : "";
product_stock_error.innerHTML = isNaN(product_stock) || product_stock.trim() === "" || parseFloat(product_stock) < 0 ? "Please enter a valid stock " : "";
product_price_error.innerHTML = isNaN(product_price) || product_price.trim() === "" || parseFloat(product_price) < 0 ? "Please enter a valid price " : "";
product_discount_price_error.innerHTML = isNaN(discount_price) || discount_price.trim() === "" || parseFloat(discount_price) < 0 ? "Please enter a valid discount price " : "";
product_description_error.innerHTML = description.trim() === "" ? "Please enter product description" : "";



return !(product_title.trim() === "" || product_brand.trim() === ""|| product_category.trim() === "" || product_stock.trim() === "" || product_price.trim() === ""|| discount_price.trim() === ""|| description.trim() === ""); 
}



