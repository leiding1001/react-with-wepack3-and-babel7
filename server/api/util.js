module.exports = {
  responseClient(res, httpCode = 500, status = 2000, context = {error: "System Error"}) {
    let responseData = {};

    responseData.status = status;
    responseData.context = context;
    res.status(httpCode).json(responseData);
  }
};