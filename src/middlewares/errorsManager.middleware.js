import EErros from "../tools/EErrors.js";

export default (err, req, res, next) => {
    req.logger.info(err.cause);
    switch (err.code) {
        case EErros.EXISTING_PRODUCT:
            res.status(501).send({ status: "error", error: err.name });
            break;
        default:
            res.status(500).send({ status: "error", error: "Internal Server Error" });
            break;
    }
};