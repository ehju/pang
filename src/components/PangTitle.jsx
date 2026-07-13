const LETTER_PIXELS = {
  P: ['1111', '1001', '1111', '1000', '1000'],
  A: ['0110', '1001', '1111', '1001', '1001'],
  N: ['1001', '1101', '1011', '1001', '1001'],
  G: ['0111', '1000', '1011', '1001', '0111'],
}

const PASTEL_COLORS = ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff']

const CELL_SIZE = 10
const CELL_GAP = 2
const LETTER_GAP = 8

function PangTitle({ text = 'PANG' }) {
  return (
    <div style={{ display: 'flex', gap: LETTER_GAP }}>
      {text.split('').map((letter, letterIndex) => {
        const rows = LETTER_PIXELS[letter]
        const color = PASTEL_COLORS[letterIndex % PASTEL_COLORS.length]

        return (
          <div
            key={`${letter}-${letterIndex}`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${rows[0].length}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${rows.length}, ${CELL_SIZE}px)`,
              gap: CELL_GAP,
            }}
          >
            {rows.flatMap((row, y) =>
              row.split('').map((bit, x) => (
                <div
                  key={`${x}-${y}`}
                  style={{ background: bit === '1' ? color : 'transparent' }}
                />
              )),
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PangTitle
