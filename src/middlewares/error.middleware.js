const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Rota não encontrada",
    path: req.originalUrl
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) return next(error);

  res.status(error.status || 500).json({
    message: error.message || "Erro interno do servidor"
  });
};

export { notFound, errorHandler };
