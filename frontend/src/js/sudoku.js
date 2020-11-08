(()=>{
    main = async () => {
        registerEvents();

        let game = await req('GET', '/game', `code=${await code()}`);
        if (game.error && game.error.includes('inválido ou expirado')) {
            $('strong#code').innerText = await newSession();
            game = await req('GET', '/game', `code=${await code()}`);
        }
        updateBoard(...Object.values(game));
    }

    /* ------ GAME MECHANICS ------ */

    victory = withHelp => {
        setModalVisibility(true, 
            withHelp ? '<center>🥈 Parabéns... eu acho?</center><br/>Deseja recomeçar?'
                     : '<center>🥇 Parabéns!</center><br/>Deseja recomeçar?');
    }

    newSession = async () => {
        let res = await req('POST', '/game', 'difficulty=0');
        setCode(res.session.code);
        setTimeout(()=>setModalVisibility(true), 0);
        return res.session.code;
    }

    joinSession = async code => {
        let res = await req('GET', '/game', `code=${code}`);
        if (res.error)
            $('p#popup-info').innerText = `Erro: ${res.error}\n`
                        + 'Insira o código da partida para continuar de onde parou:';
        else if (res.gameBoard) {
            updateBoard(res.gameBoard, res.userBoard);
            setModalVisibility(false);
            setCode(code);
        }
    }

    let notesEnabled = false;
    toggleNotes = () => {
        notesEnabled = $('.sudoku').classList.toggle('sudoku--notas');
        $('#notes').classList.toggle('badge--on')
    }

    /* ------ EVENTS ------ */

    let selectedCell = null;
    registerEvents = () => {
        
        // Board - Cell click
        for (let cell of cells) {
            cell.onblur  = () => highlight(-1, -1, -1);
            cell.onfocus = () => click(selectedCell = cell);
        }
        
        // Sidebar - Cell click
        $('.sidebar__cellbutton').forEach(btn => btn.onclick = async () => {
            if (!selectedCell) return;
            if (notesEnabled) return selectedCell.setAttribute('note', btn.innerText.trim());
            const cell = parseInt(selectedCell.getAttribute('cell'));
            let x = await req('PUT', '/define', `code=${await code()}&cell=${cell}&value=${btn.innerText.trim()}`);
            if (x.error) {
                r = x.error.includes('row')   ? -1 : selectedCell.getAttribute('r');
                c = x.error.includes('col')   ? -1 : selectedCell.getAttribute('c');
                b = x.error.includes('block') ? -1 : selectedCell.getAttribute('b');
                highlight(r, c, b, true);
            }
        });

        // Sidebar - Buttons
        $('#newGame').onclick = () => setModalVisibility(true);
        $('#notes').onclick = () => toggleNotes();
        $('#hint').onclick = async ()  => req('GET', '/hint', `code=${await code()}`);
        $('#undo').onclick = async ()  => req('PUT', '/undo', `code=${await code()}`);
        $('#erase').onclick = async () => notesEnabled ? selectedCell.setAttribute('note', '') 
                                        : req('PUT', '/delete', `code=${await code()}&cell=${selectedCell.getAttribute('cell')}`);

        // Modal Buttons
        restart = async difficulty => { await req('PUT', '/restart', `code=${await code()}&difficulty=${difficulty}`); return false; };
        $('span#close').onclick = () => setModalVisibility(false);
        $('button#easy').onclick = async () => setModalVisibility(await restart(69));
        $('button#mehh').onclick = async () => setModalVisibility(await restart(56));
        $('button#norm').onclick = async () => setModalVisibility(await restart(44));
        $('button#ouch').onclick = async () => setModalVisibility(await restart(30));
        $('button#hard').onclick = async () => setModalVisibility(await restart(17));
        $('button.button#codejoin').onclick = async () => await joinSession($('input#codeinput').value);
        $('button.button#enter').onclick = () => setModalVisibility(true, 'Continuar Jogo', 
                                                'Insira o código da partida para continuar de onde parou:');
    }

    /* ------ BOARD FUNCTIONS ------ */

    updateBoard = async (gameBoard, userBoard) => {
        let emptyCells = 0;
        for (const cell in gameBoard) (async () => {
            cellObj = cellAt(cell);
            if (gameBoard[cell] !== '.') {
                cellObj.innerText = gameBoard[cell]
                removeClass(cellObj, 'sudoku__cell--spotlight');
            } else if (gameBoard[cell] === '.' && userBoard[cell] !== '.') {
                cellObj.innerText = userBoard[cell]
                addClass(cellObj, 'sudoku__cell--spotlight');  
            } else {
                cellObj.innerText = '   ';
                emptyCells++;
            }
        })();
        if (emptyCells===0) victory(".".repeat(81)===userBoard);
    }

    /* ------  CELL FUNCTIONS ------ */

    addClass = (DOM, className) => {
        if ((DOM && !DOM.classList.contains(className)) || (DOM && !DOM.classList))
            DOM.classList.add(className)
    }

    removeClass = (DOM, className) => {
        if (DOM && DOM.classList && DOM.classList.contains(className))
            DOM.classList.remove(className)
    }

    cellAt = cell => {
        const r = Math.floor(cell / 9);
        const c = cell % 9;
        return $(`div[r="${r}"][c="${c}"]`)
    }

    highlight = (r, c, b, invalid=false) => {
        for (let cell of cells) (async () => {
            const match = cell.getAttribute('r') === r
                        | cell.getAttribute('c') === c
                        | cell.getAttribute('b') === b;
            if (!invalid)
                cell.parentElement.style.background = match ? '#E1E7EE' : '#FFF';
            else if (match) {
                addClass(cell, 'sudoku__cell--invalid');
                setTimeout(()=>removeClass(cell, 'sudoku__cell--invalid'), 200);
            }
        })()
    }

    click = cell => {
        removeClass($('.sudoku__cell--focus'), 'sudoku__cell--focus')
        addClass(cell, 'sudoku__cell--focus');

        highlight(cell.getAttribute('r'), 
                  cell.getAttribute('c'),
                  cell.getAttribute('b'));
    }

    /* ------ UTILS ------ */

    $ = query => {
        let elements = document.querySelectorAll(query);
        return elements.length===1 ? elements[0] : elements;
    }

    req = (method, endpoint, params) => {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, baseURL + endpoint + (method==='GET'?`?${params}`:''));
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                const json = JSON.parse(xhr.response);
                if (xhr.status>=400 && xhr.status<500 && !(json.error && json.error.includes('Movimento inválido.')))
                    if (!json.error)
                        throw new Error(xhr)
                if (json.gameBoard && json.userBoard)
                    updateBoard(json.gameBoard, json.userBoard)
                resolve(json)
            };
            xhr.send(params);
        });
    }

    /* ----- CODE ----- */

    setCode = value => {
        let date = new Date(new Date().getTime() + (18*24*600000)); // 3 dias
        let expires = "; expires=" + date.toUTCString();
        document.cookie = "code=" + (value || "")  + expires + "; path=/";
    }

    getCode = () => {
        let nameEQ = "code=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    code = async () => {
        let fromCookie = getCode();
        if (fromCookie) return ($('strong#code').innerText = fromCookie);
        else return $('strong#code').innerText = await newSession();
    }

    /* ----- MODAL ----- */

    defaultMessage = $('#popup-text').innerHTML;
    defaultInfo = $('#popup-info').innerHTML;
    setModalVisibility = (show, message = '', info = '') => {
        $('.modal').style.display = show ? 'block' : 'none';
        $('#popup-text').innerHTML = message ? message : defaultMessage;
        $('#popup-info').innerHTML = info ? info : defaultInfo;
        code();
        
        if (message) $('button.button#enter').style.display = 'none';
        else $('button.button#enter').style.display = 'block';
        if (info) {
            $('center#popup-buttons').style.display = 'none';
            $('center#popup-entercode').style.display = 'block';
        } else {
            $('center#popup-buttons').style.display = 'block';
            $('center#popup-entercode').style.display = 'none';
        }
    }

    /* ----- ENV VARS ----- */
    
    const backendPort = 3000;
    const cells = $('.sudoku__cell');
    let baseURL = window.location.href;
    const htIndex = baseURL.indexOf('#');
    baseURL = baseURL.substr(0, htIndex!=-1 ? htIndex : baseURL.length)
    baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    baseURL = `${baseURL}:${backendPort}/api`;

    main();
})();