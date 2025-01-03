export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("vi-VN", options)
}

export function dateToString(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}
