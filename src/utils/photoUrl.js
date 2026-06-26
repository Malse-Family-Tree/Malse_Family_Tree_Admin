export function getPhotoUrl(photo) {
  if (!photo) {
    return null;
  }

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiUrl.replace(/\/api\/?$/, "");

  return `${serverBase}${photo.startsWith("/") ? photo : `/${photo}`}`;
}
