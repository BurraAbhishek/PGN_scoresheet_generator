function render_scoresheet_mobile(placeholder, data) {
    var table = document.createElement("table");
    table.setAttribute("class", "settings_table fixed-table");
    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");
        var icolumn = document.createElement("th");
        var moveNumber = i;
        icolumn.appendChild(document.createTextNode(String(moveNumber + 1)));
        row.appendChild(icolumn);
        var whiteColumn = document.createElement("td");
        try {
            if (typeof data[moveNumber][0] === "undefined") {
                throw "Undefined";
            }
            whiteColumn.appendChild(
                document.createTextNode(data[moveNumber][0])
            );
        } catch (e) {
            whiteColumn.appendChild(document.createTextNode(""));
        }
        row.appendChild(whiteColumn);
        var blackColumn = document.createElement("td");
        try {
            if (typeof data[moveNumber][1] === "undefined") {
                throw "Undefined";
            }
            blackColumn.appendChild(
                document.createTextNode(data[moveNumber][1])
            );
        } catch (e) {
            blackColumn.appendChild(document.createTextNode(""));
        }
        row.appendChild(blackColumn);
        table.appendChild(row);
    }
    placeholder.appendChild(table);
}
