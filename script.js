const tbody = document.querySelector("#table tbody");
const url = "https://bookstore-api-six.vercel.app/api/books";
const cols = ["title", "author", "publisher"];

const deleteData = (e) => {
    const id = e.target.dataset.id // response.data["id"] should be saved to the record somehwere
    
    const bookURL = url + `/${id}`;
    axios.delete(bookURL).then(() => {
     console.log("Data deleted!");
     
    // HTML helper functions go here

    });
   };
   
   const fetchData = () => {
    axios.get(url).then(
     (response) => {
      console.log(response);
      
      // HTML helper functions go here
      
     },
     (error) => {
      console.log(error.message);
     }
    );
   };
   
   const submitData = (e) => {
    e.preventDefault();
    console.log(e.target)
    const data = {};
   
    const getFormValues = (e) => {
     const formValues = new FormData(e.target);
     formValues.forEach((value, key) => (data[key] = value));
    };
   
    getFormValues(e);
    e.target.reset()
   
    axios
     .post(url, data, {
      headers: {
       "content-type": "application/json"
      }
     })
     .then((response) => {
      console.log("POST Response:", response);
      console.log("Data was successfully sent");

      // HTML helper functions go here
     
     })
     .catch((error) => {
      if (error) {
       console.log(error.message);
      }
     });
   };
   
   // FETCH --------------------
   fetchData();
   
   // POST --------------------
   document.forms["book_form"].addEventListener("submit", submitData);