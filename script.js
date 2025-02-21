const tbody = document.querySelector("table tbody");
const url = "https://bookstore-api-six.vercel.app/api/books";
const cols = ["title", "author", "publisher"];

// Table UI HTML helper
const table = {
  template: tbody.querySelector("tr"),
  api: "https://bookstore-api-six.vercel.app/api/books",
  columns: [],
  rows: new Set(),
  htmlTags: new Map(),

  initializeColumns(...cols) {
    return cols.forEach((col) => this.columns.push(col));
  },

  initializeHTMLTags() {
    // Error handling
    if (!this.columns.length) {
      return console.error("No columns defined");
    }

    // Create <td></td> cells and set arry to hold <td></td> cells created
    cells = Array.from(this.columns, () => document.createElement("td"));
    this.htmlTags.set("tbody", cells);

    return this.htmlTags;
  },

  initializeHTML() {
    // Create HTML tags for document fragment and Set "data-type" attribute for <td></td>; this will be used to populate cells with the right column data
    this.initializeHTMLTags();
    this.htmlTags
      .get("tbody")
      .forEach((td, i) => td.setAttribute("data-type", this.columns[i]));

    // Prepend <td></td> cells to the <tr></tr> template; this will be reused later for adding rows using a template
    this.template.prepend(...this.htmlTags.get("tbody"));
  },

  populatedTableCells(obj, btn) {
    // Clone <tr></tr> template
    const tr = this.template.cloneNode(true);

    if (obj) {
      // Set data-id of <tr></tr>  to obj.id; obj.id will be used for the deleteTableRow() function
      tr.setAttribute("data-id", obj.id);

      // Select all <td></td> that are not the actions cell
      const [...tds] = tr.querySelectorAll('td:not([data-label="actions"])');

      // Update table row cells with object data based on the position of the "data-type" ("title", "publisher" etc...), ensuring the data is in the correct cell
      Object.entries(obj).forEach(([key, value]) => {
        let idx = tds.findIndex((td) => td.dataset.type === key);
        if (idx >= 0) {
          tds[idx].textContent = value;
        }
      });
    } else {
      delete tr;
    }

    // Attach event listener to the delete button on the way out
    if (btn) {
      tr.querySelector(btn).addEventListener("click", (e) =>
        deleteData(e, tr.dataset.id)
      );
    }

    return tr || null;
  },

  // Create initial table rows from API fetch 
  initializeTableRows(data) {
    for (const idx in data) {
      this.rows.add(
        this.populatedTableCells(data[idx], 'button[name="delete"]')
      );
    }
    table.syncDOM();
  },

  // Sync the HTML on the DOM with the table.rows set
  syncDOM() {
    const tbodyOnDOM = document.querySelector("table tbody");
    if (tbodyOnDOM) {
      tbodyOnDOM.replaceChildren(...Array.from(this.rows).reverse());
    }
  },
};

addTableRow = (e, obj) => {
  table.rows.add(table.populatedTableCells(obj, 'button[name="delete"]'));
  table.syncDOM();
}

deleteTableRow = (e, idx) => {
  const elemToDelete = e.target.closest(`tr[data-id="${idx}"]`);
  table.rows.delete(elemToDelete);
  table.syncDOM();
}

const deleteData = (e, idx) => {
  const bookURL = url + `/${idx}`;
  axios.delete(bookURL).then(() => {
    console.log(`Data deleted: ${bookURL}!`);
    deleteTableRow(e, idx);
  });
};

const fetchData = () => {
  axios.get(url).then(
    (response) => {
      table.initializeColumns(...cols);
      table.initializeHTML();
      table.initializeTableRows(response.data);
    },
    (error) => {
      console.log(error.message);
    }
  );
};

const submitData = (e) => {
  e.preventDefault();
  let obj = {},
    formData = new FormData(e.target);

  formData.forEach((value, key) => (obj[key] = value));
  obj.id = table.rows.size + 1;

  axios
    .post(url, obj, {
      headers: {
        "content-type": "application/json",
      },
    })
    .then((response) => {
      console.log("POST Response:", response);
      console.log("Data was successfully sent");
      addTableRow(e, obj);
      e.target.reset();
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
