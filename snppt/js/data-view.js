document.addEventListener('DOMContentLoaded', () => {
    const savedData = window.localStorage.getItem('processedNoticesData');
    const table = document.getElementById('noticesInsert');
    const tableContainer = document.getElementById('tableContainer');
    const errorMessage = document.getElementById('error');
    const printBtn = document.getElementById('printBtn');

    
    if (savedData == null) {
        tableContainer.style.display = 'none';
    } else {
        errorMessage.style.display = 'none';
        const displayData = JSON.parse(savedData);
        for (let i = 0; i < displayData.length; i++) {
            if (displayData[i].relevant) {
                const tableRow = document.createElement('tr');
                tableRow.classList.add((displayData[i].highlight) ? 'highlightNotice' : 'standardNotice');
                let tableCell = document.createElement('td');
                let text = document.createTextNode(displayData[i].category);
                tableCell.appendChild(text);
                tableRow.appendChild(tableCell);
                tableCell = document.createElement('td');
                tableCell.setAttribute('contenteditable', 'true');
                text = document.createTextNode(displayData[i].subject);
                tableCell.appendChild(text);
                tableRow.appendChild(tableCell);
                tableCell = document.createElement('td');
                tableCell.setAttribute('contenteditable', 'true');
                text = document.createTextNode(displayData[i].message);
                tableCell.appendChild(text);
                tableRow.appendChild(tableCell);
                tableCell = document.createElement('td');
                text = document.createTextNode(displayData[i].teacher);
                tableCell.appendChild(text);
                tableRow.appendChild(tableCell);
                table.appendChild(tableRow);
            }
        }
    }

    printBtn.addEventListener('click', () => {
            window.print();
    });
});