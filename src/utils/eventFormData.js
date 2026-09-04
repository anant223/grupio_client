export const buildEventFormData = (data) => {
  const fd = new FormData();

  const { image, ...payload } = data;

  fd.append("data", JSON.stringify(payload));

  if (image?.file) fd.append("image", image.file);

  return fd;
};
