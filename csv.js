function convertToCsv(domElement) {
  var csv = [];
	var rows = domElement.querySelectorAll("tbody tr, thead");

    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

		csv.push(row.join("\t"));
	}

    // Download CSV
    return(csv.join("\n"));
}

function addDownloadButton() {
  document.querySelectorAll('table.cam-table').forEach(addButtonToElement);
}

function downloadCsv(csv, filename) {
  var csvFile;
  var downloadLink;

  csvFile = new Blob([csv], {type: "text/csv"});
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

function addButtonToElement(el) {
  const button = document.createElement('button');
  button.className = "btn btn-default";
  button.innerHTML = '<span class="glyphicon glyphicon-download"></span>';
  button.style = `
    position: absolute;
    left: calc(100% - 50px);
    z-index: 999999999;
  `
  button.onclick = function(evt) {
    downloadCsv(convertToCsv(el), 'table.csv');
  }
  el.parentElement.prepend(button);
}

// Listen to DOM changes
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach(el => {
            if(el.tagName === 'TABLE' && el.className.includes('cam-table')) {
              console.log(el.className, el);
              addButtonToElement(el);
            }
          })
            // console.log('A child node has been added or removed.', mutation.chil);
        }
        // else if (mutation.type === 'attributes') {
        //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
        // }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();