module.exports = (err, req, res, next) => {
    // If duplicate Key error
    if (err.code == 11000) {
        return res.status(400).send({
            ok: false,
            message: "Duplicate key",
        });
    }

    // Monggose model
    if (err.errors) {
        var detailErrors = [];
        Object.values(err.errors).map(({ message, kind, path, value }) => {
            detailErrors.push({ message, kind, path, value });
        });

        return res.status(400).send({
            ok: false,
            message: "Constraint error see errors array to detail",
            errors: detailErrors,
        });
    }
    
    next(err);
};