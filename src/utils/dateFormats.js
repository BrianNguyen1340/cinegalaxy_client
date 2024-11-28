export const formatDateToVietnamese = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(date)
}
