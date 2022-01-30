function get_pgn() {
    return document.getElementById("target_pgn").value;
}

function parse_pgn_as_json(isAnnotated) {
    var pgn = get_pgn();
    var a = pgn.split("\n");
    score_index = 0;
    game = {
        event: "",
        site: "",
        date: "",
        round: "",
        white: "",
        black: "",
        result: "",
        pgn: [],
    };
    var parsed_metadata = [];
    score_start_index = -1;
    for (var i = 0; i < a.length; i++) {
        if (a[i][0] == "[") {
            parsed_metadata = a[i].split('"');
            if (parsed_metadata[0] == "[Event ") {
                game.event = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[Site ") {
                game.site = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[Date ") {
                game.date = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[Round ") {
                game.round = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[White ") {
                game.white = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[Black ") {
                game.black = parsed_metadata[1];
            } else if (parsed_metadata[0] == "[Result ") {
                game.result = parsed_metadata[1];
            }
        }
        if (a[i].length == 0) {
            score_start_index = i + 1;
            break;
        }
    }
    game_progress = "";
    for (var i = score_start_index; i < a.length; i++) {
        game_progress += a[i] + " ";
    }
    game.pgn = parse_moves(game_progress, isAnnotated);
    return game;
}

function isNotEmptyString(s) {
    return s != "";
}

function move_numbering(s) {
    if (!s.includes(".")) {
        return s;
    }
}

function remove_marks(move) {
    move_noannotates = "";
    for (var i = 0; i < move.length; i++) {
        if (move[i] != "!" && move[i] != "?") {
            move_noannotates += move[i];
        }
    }
    return move_noannotates;
}

function parse_moves(move_list, isAnnotated) {
    move_list_partial_cleaned = "";
    move_list_cleaned = "";
    isrecorded = 0;
    for (var i = 0; i < move_list.length; i++) {
        if (move_list[i] == "{") {
            isrecorded++;
        } else if (move_list[i] == "}") {
            isrecorded--;
        } else if (move_list[i] == "(") {
            isrecorded++;
        } else if (move_list[i] == ")") {
            isrecorded--;
        } else if (move_list[i] == "[") {
            isrecorded++;
        } else if (move_list[i] == "]") {
            isrecorded--;
        } else {
            if (isrecorded == 0) {
                move_list_partial_cleaned += move_list[i];
            }
        }
    }
    analysis_start_words = [
        "Inaccuracy.",
        "Mistake.",
        "Blunder.",
        "Checkmate",
        "Lost",
        "Brilliant",
    ];
    analysis_stop_words = ["best.", "move."];
    m = move_list_partial_cleaned.split(" ");
    m = m.filter(isNotEmptyString);
    isrecorded = true;
    for (var i = 0; i < m.length; i++) {
        if (analysis_start_words.includes(m[i])) {
            isrecorded = false;
        } else if (analysis_stop_words.includes(m[i])) {
            isrecorded = true;
        } else {
            if (isrecorded) {
                move_list_cleaned += m[i] + " ";
            }
        }
    }
    turns = move_list_cleaned.split(/ \d+\. /i);
    m = move_list_cleaned.split(" ");
    m.pop();
    m = m.filter(move_numbering);
    moves = [];
    for (var i = 0; i < m.length; i++) {
        if (i % 2 == 0) {
            if (i > 1) {
                moves.push(movesPlayed);
            }
            movesPlayed = [];
        }
        if (isAnnotated) {
            movesPlayed.push(m[i]);
        } else {
            movesPlayed.push(remove_marks(m[i]));
        }
    }
    moves.push(movesPlayed);
    if (moves[0][0] == "undefined") {
        throw "Invalid PGN detected";
    }
    return moves;
}

function parse_result(result) {
    var scores = result.split("-");
    if (typeof scores[1] === "undefined") {
        scores.push("");
        throw "Invalid PGN detected";
    }
    return {
        white: scores[0],
        black: scores[1],
    };
}

function parse_pgn(isAnnotated) {
    try {
        var data = parse_pgn_as_json(isAnnotated);
        if (window.innerWidth >= 800) {
            // Desktop
            document
                .getElementById("data-site")
                .appendChild(document.createTextNode(data["site"]));
            document
                .getElementById("data-round")
                .appendChild(document.createTextNode(data["round"]));
            document
                .getElementById("data-date")
                .appendChild(document.createTextNode(data["date"]));
            document
                .getElementById("data-white")
                .appendChild(document.createTextNode(data["white"]));
            document
                .getElementById("data-black")
                .appendChild(document.createTextNode(data["black"]));
            var result = parse_result(data["result"]);
            document
                .getElementById("data-result-white")
                .appendChild(document.createTextNode(result["white"]));
            document
                .getElementById("data-result-black")
                .appendChild(document.createTextNode(result["black"]));
            render_scoresheet(
                document.getElementById("scoresheet"),
                data["pgn"]
            );
            document.getElementById("input_page").style.display = "none";
            document.getElementById("scoresheet_pages").style.display = "block";
        } else {
            // Mobile
            if (data["result"].length < 1) {
                throw "Invalid PGN detected";
            }
            document
                .getElementById("data-site-mobile")
                .appendChild(document.createTextNode(data["site"]));
            document
                .getElementById("data-round-mobile")
                .appendChild(document.createTextNode(data["round"]));
            document
                .getElementById("data-date-mobile")
                .appendChild(document.createTextNode(data["date"]));
            document
                .getElementById("data-white-mobile")
                .appendChild(document.createTextNode(data["white"]));
            document
                .getElementById("data-black-mobile")
                .appendChild(document.createTextNode(data["black"]));
            document
                .getElementById("data-result-mobile")
                .appendChild(document.createTextNode(data["result"]));
            document.getElementById("input_page").style.display = "none";
            document.getElementById("scoresheet_pages_mobile").style.display =
                "block";
            render_scoresheet_mobile(
                document.getElementById("scoresheet-mobile"),
                data["pgn"]
            );
        }
    } catch (e) {
        alert("Invalid PGN detected.");
    }
}
