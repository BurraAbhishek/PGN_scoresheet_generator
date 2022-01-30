const rows_per_page = 20;
const columns_per_page = 3;
const total_per_page = 60;

function render_scoresheet(placeholder, moves) {
    var pages = Math.ceil(moves.length / total_per_page);
    var div = document.getElementById("score-first-page");
    render_moves(div, moves, 0);
    for (var i = 1; i < pages; i++) {
        var div = document.createElement("div");
        div.setAttribute("class", "paper scoresheet_page");
        render_moves(div, moves, total_per_page * i);
        placeholder.appendChild(div);
    }
}

function render_moves(placeholder, data, index) {
    var table = document.createElement("table");
    table.setAttribute("class", "settings_table fixed-table");
    for (var i = 0; i < rows_per_page; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < columns_per_page; j++) {
            var icolumn = document.createElement("th");
            var moveNumber = index + rows_per_page * j + i;
            icolumn.appendChild(
                document.createTextNode(String(moveNumber + 1))
            );
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
        }
        table.appendChild(row);
    }
    placeholder.appendChild(table);
}
