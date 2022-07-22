exports.verifyRole = (roles = []) => {
    return (req, res, next) => {
        // console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return res.status(401).send({
                ok: false,
                message: 'Unauthorized',
                rolesNeeded: roles
            });
        }

        return next();
    };
}