var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		posts: [],
		categories: [],
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var total = 0;  

		var op = {
			page: req.query.page || 1,
			perPage: 5,
			maxPages: 4,
			filters: {
				state: 'published',
			},
		};

		var q = keystone.list('Post').paginate(op)
			.sort('-publishedDate')
			.populate('author categories');

		/* 由于keystone本身问题，执行查询后，查询结果中的总数一直保持所有分类的总数，此处休正这个问题。
		   如果有分类，那么重置分类总数、分页数；如果没有分类，直接原有的系统生成的total和分页数组： local.data.posts.pages
		   重置分类总数的时候，在执行q.exec之前，先用q.count()得到基于该分类的查询总数；
		   
		*/		
		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);

			// 重新计算该分类的查询记录总数
			q.count(function(err, count){
				total = count;
			});

			//由于keystone本身问题，执行查询后，查询结果中的总数一直保持所有分类的总数，此处休正这个问题。
			q.exec(function (err, results) {

				locals.data.posts = results;
			// 重置分类总数
				locals.data.posts.total = total;

			// 获取执行q.exec之后的结果参数
				var options = {
					currentPage : results.currentPage,
					total : total,
				};
				var maxPages = op.maxPages;
			// 分类查询后的总页数
				locals.data.posts.totalPages = Math.ceil(options.total / op.perPage);

			// 创建生成pages数组的函数： pages数组负责生成分页器，当分页器最后一页大于总页数时，把总页数作为分页器的最后一页。


				function getPages (options, maxPages) {
					
					var surround = Math.floor(maxPages / 2);
					var firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1;
					var padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0);
					var lastPage = maxPages ? Math.min(options.total, options.currentPage + surround + padRight) : options.total;
					var padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);

					options.pages = [];

					firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);

					if(lastPage > locals.data.posts.totalPages ){
						lastPage =  locals.data.posts.totalPages;
					}

					for (var i= firstPage; i <= lastPage; i++) {
						options.pages.push(i);
					}
					
					if (firstPage !== 1) {
						options.pages.shift();
						options.pages.unshift('...');
					}
					
					if (lastPage !== Number(options.total) && lastPage > maxPages) {
						options.pages.pop();
						options.pages.push('...');
					}

					return options.pages

				}
				
				// 生成分类目录的分页器
				locals.data.posts.pages = getPages(options, maxPages);

				// 分类当前页的记录数小于，每页显示的页数，就禁止向后翻页
				if (locals.data.posts.results.length < op.perPage) {
					locals.data.posts.next = false;
				}

				next(err);
			});
		}
		// 没有分类时候的查询
		else {  
			q.exec(function (err, results) {
				locals.data.posts = results;
				next(err);
			});
		}
		
	});

	// Render the view
	view.render('blog');
};
