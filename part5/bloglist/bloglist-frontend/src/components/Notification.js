const Notification = ({ errorMessage, style }) => {
  if (errorMessage === null) {
    return null
  }

  return (
    <div className="alert" style={style}>
      {errorMessage}
    </div>
  )
}

export default Notification