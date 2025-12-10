import {useState, useEffect, useRef} from 'react';
import {RotateCcw, Trophy} from 'lucide-react';
import './BlockPuzzle.css';

const GRID_SIZE = 8;
const CELL_SIZE = 45;

const BLOCK_SHAPES = [[[1]], [[1, 1]], [[1], [1]], [[1, 1, 1]], [[1], [1], [1]], [[1, 1], [1, 1]], [[1, 1, 1], [1, 1, 1], [1, 1, 1]], [[1, 1, 1, 1]], [[1], [1], [1], [1]], [[1, 1, 1, 1, 1]], [[1], [1], [1], [1], [1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[1, 1], [1, 0]], [[1, 1], [0, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 1, 1], [0, 0, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 0], [1, 1]], [[0, 1], [0, 1], [1, 1]],];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

function BlockPuzzle() {
    const [grid, setGrid] = useState(() => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('blockPuzzleBestScore') || '0'));
    const [currentPieces, setCurrentPieces] = useState([]);
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [previewPosition, setPreviewPosition] = useState(null);
    const [isValidPlacement, setIsValidPlacement] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [clearedCells, setClearedCells] = useState(new Set());
    const [celebration, setCelebration] = useState(false);

    const gridRef = useRef(null);

    const generateRandomPiece = () => {
        const shape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {shape, color, id: Math.random()};
    };

    const generatePieces = () => {
        return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
    };

    const getPieceDimensions = (piece) => {
        if (!piece || !piece.shape || !piece.shape[0]) return {width: 0, height: 0};

        const {shape} = piece;
        const rows = shape.length;
        const cols = shape[0].length;

        const maxSize = Math.max(rows, cols);
        const cellSize = maxSize <= 2 ? 30 : maxSize === 3 ? 24 : 18;
        const gap = 3;

        const width = cols * cellSize + (cols - 1) * gap;
        const height = rows * cellSize + (rows - 1) * gap;

        return {width, height};
    };

    useEffect(() => {
        setCurrentPieces(generatePieces());
    }, []);

    useEffect(() => {
        if (currentPieces.length === 0 && !gameOver) {
            setCurrentPieces(generatePieces());
        }
    }, [currentPieces, gameOver]);

    useEffect(() => {
        if (currentPieces.length > 0 && !gameOver) {
            const hasValidMove = currentPieces.some(piece => {
                if (!piece) return false;
                return canPlaceAnywhere(piece.shape);
            });

            if (!hasValidMove) {
                setGameOver(true);
            }
        }
    }, [currentPieces, grid]);

    const canPlaceAnywhere = (shape) => {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (canPlacePiece(shape, row, col)) {
                    return true;
                }
            }
        }
        return false;
    };

    const canPlacePiece = (shape, gridRow, gridCol) => {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    const targetRow = gridRow + row;
                    const targetCol = gridCol + col;

                    if (targetRow < 0 || targetRow >= GRID_SIZE || targetCol < 0 || targetCol >= GRID_SIZE || grid[targetRow][targetCol] !== null) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const placePiece = (piece, gridRow, gridCol) => {
        const newGrid = grid.map(row => [...row]);
        const {shape, color} = piece;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    newGrid[gridRow + row][gridCol + col] = color;
                }
            }
        }

        setGrid(newGrid);
        setCurrentPieces(prev => prev.filter(p => p.id !== piece.id));

        const pieceScore = shape.flat().filter(cell => cell === 1).length;
        setScore(prev => prev + pieceScore);

        setTimeout(() => clearLines(newGrid), 300);
    };

    const clearLines = (currentGrid) => {
        const newClearedCells = new Set();
        const rowsToClear = [];
        const colsToClear = [];

        for (let row = 0; row < GRID_SIZE; row++) {
            if (currentGrid[row].every(cell => cell !== null)) {
                rowsToClear.push(row);
                for (let col = 0; col < GRID_SIZE; col++) {
                    newClearedCells.add(`${row}-${col}`);
                }
            }
        }

        for (let col = 0; col < GRID_SIZE; col++) {
            if (currentGrid.every(row => row[col] !== null)) {
                colsToClear.push(col);
                for (let row = 0; row < GRID_SIZE; row++) {
                    newClearedCells.add(`${row}-${col}`);
                }
            }
        }

        if (newClearedCells.size > 0) {
            setClearedCells(newClearedCells);
            setCelebration(true);

            setTimeout(() => {
                const newGrid = currentGrid.map(row => [...row]);

                rowsToClear.forEach(row => {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        newGrid[row][col] = null;
                    }
                });

                colsToClear.forEach(col => {
                    for (let row = 0; row < GRID_SIZE; row++) {
                        newGrid[row][col] = null;
                    }
                });

                setGrid(newGrid);
                setClearedCells(new Set());
                setCelebration(false);

                const linesCleared = new Set([...rowsToClear, ...colsToClear.map(c => `col${c}`)]).size;
                const clearBonus = linesCleared * GRID_SIZE * 2;
                setScore(prev => {
                    const newScore = prev + clearBonus;
                    if (newScore > bestScore) {
                        setBestScore(newScore);
                        localStorage.setItem('blockPuzzleBestScore', newScore.toString());
                    }
                    return newScore;
                });
            }, 400);
        }
    };

    const getGridPosition = (clientX, clientY) => {
        if (!gridRef.current) return null;

        const gridRect = gridRef.current.getBoundingClientRect();
        const x = clientX - gridRect.left;
        const y = clientY - gridRect.top;

        if (x < 0 || y < 0 || x > gridRect.width || y > gridRect.height) {
            return null;
        }

        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);

        return {row, col};
    };

    const handleMouseDown = (piece, e) => {
        e.preventDefault();
        const {width, height} = getPieceDimensions(piece);
        setDraggedPiece(piece);
        setDragOffset({
            x: width / 2, y: height / 2
        });
        setMousePosition({x: e.clientX, y: e.clientY});
    };

    const handleMouseMove = (e) => {
        if (!draggedPiece) return;

        setMousePosition({x: e.clientX, y: e.clientY});

        const gridPos = getGridPosition(e.clientX, e.clientY);
        if (gridPos) {
            const canPlace = canPlacePiece(draggedPiece.shape, gridPos.row, gridPos.col);
            setPreviewPosition(gridPos);
            setIsValidPlacement(canPlace);
        } else {
            setPreviewPosition(null);
            setIsValidPlacement(false);
        }
    };

    const handleMouseUp = (e) => {
        if (!draggedPiece) return;
        const gridPos = getGridPosition(e.clientX, e.clientY);
        if (gridPos && canPlacePiece(draggedPiece.shape, gridPos.row, gridPos.col)) {
            placePiece(draggedPiece, gridPos.row, gridPos.col);
        }
        setDraggedPiece(null);
        setPreviewPosition(null);
        setIsValidPlacement(false);
    };

    const handleTouchStart = (piece, e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const {width, height} = getPieceDimensions(piece);
        setDraggedPiece(piece);
        setDragOffset({
            x: width / 2, y: height / 2
        });
        setMousePosition({x: touch.clientX, y: touch.clientY});
    };

    const handleTouchMove = (e) => {
        if (!draggedPiece) return;
        e.preventDefault();

        const touch = e.touches[0];
        setMousePosition({x: touch.clientX, y: touch.clientY});

        const gridPos = getGridPosition(touch.clientX, touch.clientY);
        if (gridPos) {
            const canPlace = canPlacePiece(draggedPiece.shape, gridPos.row, gridPos.col);
            setPreviewPosition(gridPos);
            setIsValidPlacement(canPlace);
        } else {
            setPreviewPosition(null);
            setIsValidPlacement(false);
        }
    };

    const handleTouchEnd = (e) => {
        if (!draggedPiece) return;

        const touch = e.changedTouches[0];
        const gridPos = getGridPosition(touch.clientX, touch.clientY);

        if (gridPos && canPlacePiece(draggedPiece.shape, gridPos.row, gridPos.col)) {
            placePiece(draggedPiece, gridPos.row, gridPos.col);
        }

        setDraggedPiece(null);
        setPreviewPosition(null);
        setIsValidPlacement(false);
    };

    useEffect(() => {
        if (draggedPiece) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, {passive: false});
            window.addEventListener('touchend', handleTouchEnd);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [draggedPiece, grid]);

    const resetGame = () => {
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
        setScore(0);
        setCurrentPieces(generatePieces());
        setGameOver(false);
        setDraggedPiece(null);
        setPreviewPosition(null);
    };

    const renderPiece = (piece, isDragging = false) => {
        if (!piece) return null;

        const {shape, color} = piece;
        const maxSize = Math.max(shape.length, shape[0]?.length || 0);
        const cellSize = maxSize <= 2 ? 30 : maxSize === 3 ? 24 : 18;

        return (<div
            className={`piece ${isDragging ? 'dragging' : ''}`}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`,
                gap: '3px',
                opacity: isDragging ? 0 : 1, // 隱藏正在拖曳的下方積木
            }}
        >
            {shape.map((row, rowIndex) => (row.map((cell, colIndex) => (<div
                key={`${rowIndex}-${colIndex}`}
                className="piece-cell"
                style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: cell === 1 ? color : 'transparent',
                    opacity: cell === 1 ? 1 : 0,
                }}
            />))))}
        </div>);
    };

    return (<div className="block-puzzle-container">
        <div className="game-header">
            <div className="score-container">
                <div className="score-box">
                    <div className="score-label">Score</div>
                    <div className="score-value">{score}</div>
                </div>
                <div className="score-box best">
                    <Trophy className="trophy-icon" size={18}/>
                    <div className="score-label">Best</div>
                    <div className="score-value">{bestScore}</div>
                </div>
            </div>

            <button className="reset-button" onClick={resetGame}>
                <RotateCcw size={20}/>
                <span>New Game</span>
            </button>
        </div>

        <div className={`grid-container ${celebration ? 'celebration' : ''}`} ref={gridRef}>
            <div
                className="grid"
                style={{
                    display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`, gap: '2px',
                }}
            >
                {grid.map((row, rowIndex) => (row.map((cell, colIndex) => {
                    const isClearedCell = clearedCells.has(`${rowIndex}-${colIndex}`);
                    const isPreview = previewPosition && draggedPiece && (() => {
                        for (let r = 0; r < draggedPiece.shape.length; r++) {
                            for (let c = 0; c < draggedPiece.shape[r].length; c++) {
                                if (draggedPiece.shape[r][c] === 1 && previewPosition.row + r === rowIndex && previewPosition.col + c === colIndex) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })();

                    return (<div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${cell ? 'filled' : ''} ${isClearedCell ? 'cleared' : ''} ${isPreview ? (isValidPlacement ? 'preview-valid' : 'preview-invalid') : ''}`}
                        style={{
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                            backgroundColor: cell || (isPreview && isValidPlacement ? draggedPiece.color : ''),
                        }}
                    />);
                })))}
            </div>
        </div>

        <div className="pieces-container">
            {currentPieces.map((piece, index) => (piece ? (<div
                key={piece.id}
                className={`piece-holder ${!canPlaceAnywhere(piece.shape) ? 'no-valid-move' : ''}`}
                onMouseDown={(e) => handleMouseDown(piece, e)}
                onTouchStart={(e) => handleTouchStart(piece, e)}
            >
                {renderPiece(piece, draggedPiece?.id === piece.id)}
            </div>) : <div key={index} className="piece-holder empty"/>))}
        </div>

        {draggedPiece && (<div
            className="dragged-piece"
            style={{
                position: 'fixed',
                left: mousePosition.x - dragOffset.x,
                top: mousePosition.y - dragOffset.y,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {renderPiece(draggedPiece)}
        </div>)}

        {gameOver && (<div className="game-over-overlay">
            <div className="game-over-modal">
                <h2>Game Over!</h2>
                <div className="final-score">
                    <div className="score-label">Final Score</div>
                    <div className="score-value">{score}</div>
                </div>
                {score === bestScore && score > 0 && (<div className="new-best">New Best Score!</div>)}
                <button className="play-again-button" onClick={resetGame}>
                    Play Again
                </button>
            </div>
        </div>)}
    </div>);
}

export default BlockPuzzle;