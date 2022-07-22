// Cats ObjectId to String
exports.getObjId = (id) => {
    return id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
}

// Gets id as string and checks if its a valid id
exports.validId = (id) => {
    return String(id)
        .match(
            /^[0-9a-fA-F]{24}$/
        );
}