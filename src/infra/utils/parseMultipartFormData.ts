export async function parseMultipartFormData(part: any) {
  const buffer = await part.toBuffer();

  part.value = {
    filename: part.filename,
    fileType: part.mimetype,
    buffer,
  };

  return part;
}
