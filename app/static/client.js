var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  
  if (uploadFiles.length !== 1) {
    alert("Please select a file to analyze!");
    return;
  }

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      buildResponse(JSON.parse(e.target.responseText));
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.push("file", uploadFiles[0]);
  xhr.send(fileData);
}

function buildResponse(response) {
  const rows = document.createDocumentFragment();
  
  response.forEach(rowData => {
    const row = document.createElement('div'); row.classList.add('row');
    
    rowData.forEach(({url, json, meta}) => {
      const column = document.createElement('div'); column.classList.add('col');
      
      if (url) {
        const img = document.createElement('img'); img.src = url;
        column.appendChild(img);
      }
      
      if (json) {
        const formatter = new JSONFormatter(json);
        column.appendChild(formatter.render());
      }
      
      if (meta) {
        const p = document.createElement('p');
        p.innerText = meta;
        column.appendChild(p);
      }
      
      row.appendChild(column);
    });
    
    rows.appendChild(row);
  });
  
  el("response").appendChild(rows);
}

// EXAMPLE - remove after implementation
window.addEventListener('load', function() {
  buildResponse([
    [
        {
            url: 'https://cdn4.buysellads.net/uu/7/53660/1572641638-MC_CSSTricks_logo_600x600.png',
            json: null,
            meta: 'lorem ipsum dolor',
        },
        {
            url: 'https://cdn4.buysellads.net/uu/7/53660/1572641638-MC_CSSTricks_logo_600x600.png',
            json: null,
            meta: 'lorem ipsum dolor',
        },
    ],
    [
      {
          url: 'https://cdn4.buysellads.net/uu/7/53660/1572641638-MC_CSSTricks_logo_600x600.png',
          json: null,
          meta: 'lorem ipsum dolor',
      },
      {
        url: null,
        json: {
            "id": 1001,
            "type": "donut",
            "name": "Cake",
            "price": 2.55,
            "available": true,
            "topping": [
              { "id": 5001, "type": "None" },
              { "id": 5002, "type": "Glazed" },
              { "id": 5005, "type": "Sugar" },
              { "id": 5006, "type": "Powdered Sugar" },
              { "id": 5003, "type": "Chocolate" },
              { "id": 5004, "type": "Maple" }
            ]
          },
        meta: null,
      },
    ],
  ]);
});
