/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

define([], () => {
  async function skipThroughPages(parentElement, el, csv) {
    console.log(csv);
    const withHead = typeof csv === 'undefined';
    csv = csv || [];

    var paginationElement = parentElement.querySelector('[uib-pagination]');
    csv = csv.concat(convertCurrentView(el, withHead));

    if (paginationElement.querySelector('.pagination-next.disabled')) {
      downloadCsv(csv.join('\n'), 'allPages.csv');
      return;
    }

    const reloadListener = function(mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      var connected = true;
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach(ele => {
            if (ele.tagName === 'TR') {
              observer.disconnect();
              connected &&
                skipThroughPages(
                  parentElement,
                  parentElement.querySelector('table.cam-table'),
                  csv
                );
              connected = false;
              return;
            }
          });
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(reloadListener);

    console.log(targetNode, config);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    paginationElement.querySelector('.pagination-next a').click();
  }

  function convertCurrentView(domElement, withHead) {
    withHead = typeof withHead !== undefined ? withHead : true;
    var csv = [];
    var selector = withHead ? 'tbody tr, thead' : 'tbody tr';
    var rows = domElement.querySelectorAll(selector);

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th');

      for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

      csv.push(row.join('\t'));
    }
    return csv;
  }

  async function convertToCsv(domElement) {
    var csv = [];
    csv = csv.concat(convertCurrentView(domElement, true));
    // Download CSV
    downloadCsv(csv.join('\n'), 'table.csv');
  }

  function addDownloadButton() {
    document.querySelectorAll('table.cam-table').forEach(addButtonToElement);
  }

  function downloadCsv(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: 'text/csv'});
    downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }

  function addButtonToElement(el) {
    const button = document.createElement('button');
    button.className = 'btn btn-default';
    button.innerHTML = '<span class="glyphicon glyphicon-download"></span>';
    button.style = `
      position: absolute;
      left: calc(100% - 50px);
      z-index: 999999999;
    `;
    button.onclick = function(evt) {
      convertToCsv(el);
    };
    el.parentElement.prepend(button);
  }

  function addDownloadAllButton(el) {
    const button = document.createElement('button');
    button.className = 'btn btn-default';
    button.innerHTML =
      '<span class="glyphicon glyphicon-menu-hamburger"></span>';
    button.style = `
      position: absolute;
      left: calc(100% - 100px);
      z-index: 999999999;
    `;
    button.onclick = function(evt) {
      skipThroughPages(el.parentElement, el);
    };
    el.parentElement.prepend(button);
  }

  // Listen to DOM changes
  const targetNode = document.body;

  // Options for the observer (which mutations to observe)
  const config = {attributes: true, childList: true, subtree: true};

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        mutation.addedNodes.forEach(el => {
          if (
            el &&
            (el.tagName === 'TABLE' && el.className.includes('cam-table')) //||
            // (el = el.querySelector('table.cam-table')))
          ) {
            window.setTimeout(() => {
              addButtonToElement(el);
              if (el.parentElement.querySelector('[uib-pagination]'))
                addDownloadAllButton(el);
            }, 100);
          } else if (
            el &&
            el.querySelector &&
            (el = el.querySelector('table.cam-table'))
          ) {
            window.setTimeout(() => {
              addButtonToElement(el);
              if (el.parentElement.querySelector('[uib-pagination]'))
                addDownloadAllButton(el);
            }, 100);
          }
        });
      }
    }
  };

  addDownloadButton();
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  // observer.disconnect();
});
