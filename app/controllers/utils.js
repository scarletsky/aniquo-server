exports.setLikedField = function(document, userId) {
    var isLiked;

    if (typeof document.toObject === 'function') {
        document = document.toObject();
    }

    if (typeof userId !== 'undefined') {

        if (document.likerIds.indexOf(userId) !== -1) {
            isLiked = true;
        } else {
            isLiked = false;
        }

        delete document.likerIds;
        document.liked = isLiked;

        return document;

    } else {

        delete document.likerIds;

        return document;

    }

};
