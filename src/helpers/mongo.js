const regExpforID  = /^[0-9a-fA-F]{24}$/;

const isValidMongoId = (id) => (id.match(regExpforID)) ? true : false;

module.exports = {
    isValidMongoId
};