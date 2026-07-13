function PixelButton({ children, style, ...props }) {
  return (
    <button type="button" className="pixel-button" style={style} {...props}>
      {children}
    </button>
  )
}

export default PixelButton
