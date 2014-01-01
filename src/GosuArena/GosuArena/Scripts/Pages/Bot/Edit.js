$(function () {
    var textArea = document.getElementById("editor");
    var editor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
        mode: "javascript",
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        matchBrackets: true,
        highlightSelectionMatches: { showToken: /\w/ },
        styleActiveLine: true
    });
});