exports.getStandardResponse = (status, message, data, req) => {
  var fullUrl = req.protocol + "://" + req.headers.host + req.originalUrl;
  return {
    status: status,
    message: message,
    data,
    links: {
      self: fullUrl,
    },
  };
};
