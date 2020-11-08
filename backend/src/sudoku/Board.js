class Board {
	constructor(sudoku) {
		if (typeof sudoku === 'number') this.sudoku = this.generate(sudoku);
		else if (sudoku) this.sudoku = sudoku;
		else this.sudoku = ".".repeat(81);
	}

	generate(qnt) {
		qnt = 81-qnt;
		let solved = this.solve(".".repeat(81))
		let cells = this.randomOrder(81);
		while(qnt-->0)
			solved = this.replaceCell(cells.next().value, '.', solved);
		return solved;
	}

	*randomOrder(qnt) {
		let array = [...Array(qnt).keys()];
		let i = qnt;
		while (i--)
			yield array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
	}

	// given a cell (index), value (replacement) and sudoku (string), replace cell
	replaceCell(cell, value, sudoku = null) {
		let replace;
		if (!sudoku) replace = sudoku = this.sudoku;
		sudoku = sudoku.substr(0, cell) + value + sudoku.substr(1 + parseInt(cell));
		return replace ? this.sudoku = sudoku : sudoku;
	}

	// given a sudoku cell, returns the row
	returnRow(cell) {
		return Math.floor(cell / 9);
	}

	// given a sudoku cell, returns the column
	returnCol(cell) {
		return cell % 9;
	}

	// given a sudoku cell, returns the 3x3 block
	returnBlock(cell) {
		return (
			Math.floor(this.returnRow(cell) / 3) * 3 +
			Math.floor(this.returnCol(cell) / 3)
		);
	}

	// given a number, a row and a sudoku, returns true if the number can be placed in the row
	isPossibleRow(number, row, sudoku) {
		for (let i = 0; i <= 8; i++)
			if (sudoku[row * 9 + i] == number) return '';
		return 'row';
	}

	// given a number, a column and a sudoku, returns true if the number can be placed in the column
	isPossibleCol(number, col, sudoku) {
		for (let i = 0; i <= 8; i++)
			if (sudoku[col + 9 * i] == number) return '';
		return 'col';
	}

	// given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
	isPossibleBlock(number, block, sudoku) {
		for (let i = 0; i <= 8; i++)
			if (
				sudoku[
					Math.floor(block / 3) * 27 +
						(i % 3) +
						9 * Math.floor(i / 3) +
						3 * (block % 3)
				] == number
			)
				return '';
		return 'block';
	}

	// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
	isPossibleNumber(cell, number, sudoku) {
		let row = this.returnRow(cell);
		let col = this.returnCol(cell);
		let block = this.returnBlock(cell);
		let condition = [];
		condition.push(this.isPossibleRow(number, row, sudoku));
		condition.push(this.isPossibleCol(number, col, sudoku));
		condition.push(this.isPossibleBlock(number, block, sudoku));
		return condition.filter(x=>x);
	}

	// given a row and a sudoku, returns true if it's a legal row
	isCorrectRow(row, sudoku) {
		let rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
		let rowTemp = new Array();
		for (let i = 0; i <= 8; i++) rowTemp[i] = sudoku[row * 9 + i];
		rowTemp.sort();
		return rowTemp.join() == rightSequence.join();
	}

	// given a column and a sudoku, returns true if it's a legal column
	isCorrectCol(col, sudoku) {
		let rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
		let colTemp = new Array();
		for (let i = 0; i <= 8; i++) colTemp[i] = sudoku[col + i * 9];
		colTemp.sort();
		return colTemp.join() == rightSequence.join();
	}

	// given a 3x3 block and a sudoku, returns true if it's a legal block
	isCorrectBlock(block, sudoku) {
		let rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
		let blockTemp = new Array();
		for (let i = 0; i <= 8; i++)
			blockTemp[i] =
				sudoku[
					Math.floor(block / 3) * 27 +
						(i % 3) +
						9 * Math.floor(i / 3) +
						3 * (block % 3)
				];
		blockTemp.sort();
		return blockTemp.join() == rightSequence.join();
	}

	// given a sudoku, returns true if the sudoku is solved
	isSolvedSudoku(sudoku = this.toArray()) {
		for (let i = 0; i <= 8; i++)
			if (
				!this.isCorrectBlock(i, sudoku) ||
				!this.isCorrectRow(i, sudoku) ||
				!this.isCorrectCol(i, sudoku)
			)
				return false;
		return true;
	}

	// given a cell and a sudoku, returns an array with all possible values we can write in the cell
	determinePossibleValues(cell, sudoku) {
		let possible = new Array();
		for (let i = 1; i <= 9; i++)
			if (this.isPossibleNumber(cell, i, sudoku).length===3) possible.unshift(i);
		return possible;
	}

	// given an array of possible values assignable to a cell, returns a random value picked from the array
	determineRandomPossibleValue(possible, cell) {
		let randomPicked = Math.floor(Math.random() * possible[cell].length);
		return possible[cell][randomPicked];
	}

	// given a sudoku, returns a two dimension array with all possible values
	scanSudokuForUnique(sudoku) {
		let possible = new Array();
		for (let i = 0; i <= 80; i++)
			if (sudoku[i] == 0) {
				possible[i] = new Array();
				possible[i] = this.determinePossibleValues(i, sudoku);
				if (possible[i].length == 0) {
					return false;
				}
			}
		return possible;
	}

	// given an array and a number, removes the number from the array
	removeAttempt(attemptArray, number) {
		let newArray = new Array();
		for (let i = 0; i < attemptArray.length; i++)
			if (attemptArray[i] != number) newArray.unshift(attemptArray[i]);
		return newArray;
	}

	// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
	nextRandom(possible) {
		let max = 9;
		let minChoices = 0;
		for (let i = 0; i <= 80; i++)
			if (possible[i] != undefined)
				if (possible[i].length <= max && possible[i].length > 0) {
					max = possible[i].length;
					minChoices = i;
				}
		return minChoices;
	}

	solveNext(steps) {
		let unsolved = this.sudoku;
		let unsolvedPos = [];
		let solved = this.solve();
		if (!solved) return solved;
		Object.keys(unsolved).forEach(i=>{
			if (unsolved[i]==='.') unsolvedPos.push(i);
		});
		let qnt = unsolvedPos.length;
		let cells = this.randomOrder(qnt);
		while(steps-->0) {
			if (!unsolved.toString().includes('.')) return false;
			let cell = cells.next();
			if (!cell) continue;
			let pos = unsolvedPos[cell.value];
			unsolved = this.replaceCell(pos, solved[pos], unsolved);
		}
		this.sudoku = unsolved;
		return unsolved;
	}

	solve(sudoku) {
		if (!sudoku) sudoku = this.sudoku;
		if (typeof sudoku === "string") sudoku = this.toArray(sudoku);
		let saved = new Array();
		let savedSudoku = new Array();
		let nextMove;
		let whatToTry;
		let attempt;
		while (!this.isSolvedSudoku(sudoku)) {
			nextMove = this.scanSudokuForUnique(sudoku);
			if (nextMove == false) {
				nextMove = saved.pop();
				sudoku = savedSudoku.pop();
			}
			if (!nextMove) return false;
			whatToTry = this.nextRandom(nextMove);
			attempt = this.determineRandomPossibleValue(nextMove, whatToTry);
			if (nextMove[whatToTry].length > 1) {
				nextMove[whatToTry] = this.removeAttempt(
					nextMove[whatToTry],
					attempt
				);
				saved.push(nextMove.slice());
				savedSudoku.push(sudoku.slice());
			}
			sudoku[whatToTry] = attempt;
		}
		return sudoku.join('');
	}

	toArray(sudoku='') {
		return (sudoku ? sudoku : this.sudoku).replace(/\./g, "0").split("");
	}
	
	toString() {
		return this.sudoku.replace(/0/g, '.');
	}
}

module.exports = Board;