export const responseHandler = (
  res,
  statusCode,
  message,
  data = null,
) => {
  const response = {
    statusCode, 
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};