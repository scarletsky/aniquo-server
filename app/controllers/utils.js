exports.paging = function (req, res, Class, options) {
  var paginationId = req.query.paginationId;
  var perPage = req.query.perPage || 10;
  var currentPage = parseInt(req.query.currentPage);
  var page = parseInt(req.query.page);

  Class
    .count(options.targetCriteria)
    .exec(function (err, count) {

      if (!paginationId || page === 1) {
        Class
          .find(options.targetCriteria)
          .sort({_id: 1})
          .limit(perPage)
          .exec(function (err, objects) {
            return res.send({
              total: count,
              objects: objects,
              perPage: perPage
            });
          });

        // 从其他页面返回列表页面
        } else if (currentPage === page) {
          Class
            .find(options.otherPageCriteria)
            .sort({_id: 1})
            .limit(perPage)
            .exec(function (err, objects) {
              return res.send({
                total: count,
                objects: objects,
                perPage: perPage
              });
            });

        // 向后翻页
        } else if (currentPage < page) {
          Class
            .find(options.nextPageCriteria)
            .sort({_id: 1})
            .skip((page - currentPage - 1) * perPage + (perPage - 1))
            .limit(perPage)
            .exec(function (err, objects) {
              return res.send({
                total: count,
                objects: objects,
                perPage: perPage
              });
            });

        // 向前翻页
        } else {
          Class
            .find(options.prevPageCriteria)
            .sort({_id: 1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec(function (err, objects) {
              return res.send({
                total: count,
                objects: objects,
                perPage: perPage
              });
            });
        }
    });
};

exports.setLikedField = function (document, userId) {
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
