(()=>{
    function highlight(r, c, b) {
        for (let cell of cells)
            cell.parentElement.style.background = 
             
               cell.getAttribute('r') === r
             | cell.getAttribute('c') === c
             | cell.getAttribute('b') === b
             ? '#E1E7EE' : '#FFF';
    }

    function click(cell) {
        highlight(cell.getAttribute('r'), 
                  cell.getAttribute('c'),
                  cell.getAttribute('b'));
    }

    // register events
    let cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.onblur = () => highlight(-1, -1, -1);
        cell.onfocus = () => click(cell)
    }
})();