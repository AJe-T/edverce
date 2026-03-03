export const getYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/")[2] ?? null;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/")[2] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const getYoutubeEmbedUrl = (url: string) => {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?rel=0`;
};
