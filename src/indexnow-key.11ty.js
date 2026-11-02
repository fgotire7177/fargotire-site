// Serves the IndexNow key file at /<key>.txt (the file's only content is the key).
export const data = {
  permalink: (data) => `/${data.indexnow.key}.txt`,
  eleventyExcludeFromCollections: true
};

export default function (data) {
  return data.indexnow.key;
}
