const PIXEL_ROWS = [
  '..gggggg..',
  '.gggggggg.',
  'gggggggggg',
  'gggggggggg',
  'gggggggggg',
  'gggggggggg',
  '.gggggggg.',
  '..gggggg..',
  '....gg....',
  '....gg....',
]

const COLOR_MAP = {
  g: '#4ade80',
  '.': 'transparent',
}

const CELL_SIZE = 16

function PangIntroArt() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${PIXEL_ROWS[0].length}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${PIXEL_ROWS.length}, ${CELL_SIZE}px)`,
      }}
    >
      {PIXEL_ROWS.flatMap((row, y) =>
        row.split('').map((char, x) => (
          <div
            key={`${x}-${y}`}
            style={{ background: COLOR_MAP[char] ?? 'transparent' }}
          />
        )),
      )}
    </div>
  )
}

export default PangIntroArt
