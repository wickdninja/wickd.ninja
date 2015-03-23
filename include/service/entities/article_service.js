/*
	Copyright (C) 2014  PencilBlue, LLC

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Reusable service classes to be called from controllers
 *
 * @module Services
 */

/**
 * Retrieves articles and pages
 *
 * @class ArticleService
 * @constructor
 *
 */
function ArticleService(){
	this.object_type = 'article';
}

/**
 * Rerieves the content type
 *
 * @method getContentType
 * @return {String} Content type
 */
ArticleService.prototype.getContentType = function() {
	return this.object_type;
};

/**
 * Sets the content type (article, page)
 *
 * @method setContentType
 * @param {String} type The content type
 */
ArticleService.prototype.setContentType = function(type) {
	this.object_type = type;
};

/**
 * Finds an article or page by Id
 *
 * @method findById
 * @param {String}   articleId The article's object Id
 * @param {Function} cb        Callback function
 */
ArticleService.prototype.findById = function(articleId, cb) {
	this.find(pb.DAO.getIDWhere(articleId), cb);
};

/**
 * Finds articles by section
 *
 * @method findBySection
 * @param {String}   sectionId The section's object Id
 * @param {Function} cb        Callback function
 */
ArticleService.prototype.findBySection = function(sectionId, cb) {
	this.find({article_sections: sectionId}, cb);
};

/**
 * Finds articles and pages by topic
 *
 * @method findByTopic
 * @param {[type]}   topicId The topic's object Id
 * @param {Function} cb      Callback function
 */
ArticleService.prototype.findByTopic = function(topicId, cb) {
	this.find({article_topics: topicId}, cb);
};

/**
 * Finds articles and pages matching criteria
 *
 * @method find
 * @param {Object} where Defines the where clause for the article search
 * @param {Object} options The options object that can provide query control
 * parameters
 * @param {Array} [options.order] The order that the results will be returned
 * in.  The default is publish date descending and created descending
 * @param {Object} [options.select] The fields that will be returned for each
 * article that matches the criteria
 * @param {Integer} [options.limit] The number of results to return
 * @param {Integer} [options.offset] The number of articles to skip before
 * returning results
 * @param {Function} cb Callback function that takes two parameters: the first
 * is an error, if occurred.  The second is an array of articles or possibly
 * null if an error occurs.
 */
ArticleService.prototype.find = function(where, options, cb) {
    if (pb.utils.isFunction(options)) {
        cb      = options;
        options = {};
    }
    else if (!options) {
        options = {};
    }

    //verify the where is valid
    if (!pb.utils.isObject(where)) {
        return cb(new Error('The where clause must be an object'));
    }

    //build out query
    if(!where.publish_date) {
		where.publish_date = {$lt: new Date()};
	}
	if(!where.draft) {
	    where.draft = {$ne: 1};
    }

    //build out the ordering
    var order;
    if (util.isArray(options.order)) {
        order = options.order;
    }
    else {
        order = [['publish_date', pb.DAO.DESC], ['created', pb.DAO.DESC]];
    }

    //build out select
    var select;
    if (pb.utils.isObject(options.select)) {
        select = options.select;
    }
    else {
        select = pb.DAO.SELECT_ALL;
    }

    //build out the limit (must be a valid integer)
    var limit = undefined;
    if (pb.validation.isInt(options.limit, true, true)) {
        limit = options.limit;
    }

    //build out the limit (must be a valid integer)
    var offset = 0;
    if (pb.validation.isInt(options.offset, true, true)) {
        offset = options.offset;
    }

	var self = this;
	var dao  = new pb.DAO();
	dao.q(this.getContentType(), {where: where, select: select, order: order, limit: limit, offset: offset}, function(err, articles) {
		if (util.isError(err)) {
			return cb(err, []);
		}
		else if (articles.length === 0) {
			return cb(null, []);
		}

		//get authors
		self.getArticleAuthors(articles, function(err, authors) {

			pb.content.getSettings(function(err, contentSettings) {
				if(!contentSettings.read_more_text) {
					var defaultSettings = pb.content.getDefaultSettings();
					contentSettings.read_more_text = defaultSettings.read_more_text;
				}

				var tasks = pb.utils.getTasks(articles, function(articles, i) {
					return function(callback) {
						self.processArticleForDisplay(articles[i], articles.length, authors, contentSettings, function(){
							callback(null, null);
						});
					};
				});
				async.series(tasks, function(err, results) {
					cb(err, articles);
				});
			});
		});
	});

};

/**
 * Updates articles
 *
 * @param {String} articleId	id of article
 * @param {Object} fields	fields to update
 * @param {Object} options
 * @param {Function} cb      Callback function
 */
ArticleService.prototype.update = function(articleId, fields, options, cb) {
        if(!pb.utils.isObject(fields)){
                return cb(new Error('The fields parameter is required'));
        }

	var where = pb.DAO.getIdWhere(articleId);
        var content_type = this.getContentType();

	var dao  = new pb.DAO();
	dao.updateFields(content_type, where, fields, options, cb);
};

/**
 * Retrieves data necessary for displaying an articles and appends it to the
 * article object
 *
 * @method processArticleForDisplay
 * @param {Object}   article         The artice to process
 * @param {Number}   articleCount    The total number of articles
 * @param {Array}    authors         Available authors retrieved from the database
 * @param {Object}   contentSettings Content settings to use for processing
 * @param {Function} cb              Callback function
 */
ArticleService.prototype.processArticleForDisplay = function(article, articleCount, authors, contentSettings, cb) {
	var self = this;

	if (this.getContentType() === 'article') {
		if(contentSettings.display_bylines) {

	        for(var j = 0; j < authors.length; j++) {

	        	if(authors[j]._id.equals(ObjectID(article.author))) {
	                if(authors[j].photo && contentSettings.display_author_photo) {
	                    article.author_photo     = authors[j].photo;
	                    article.media_body_style = '';
	                }

	                article.author_name     = pb.users.getFormattedName(authors[j]);
	                article.author_position = (authors[j].position && contentSettings.display_author_position) ? authors[j].position : '';
	                break;
	            }
	        }
	    }

	    if(contentSettings.display_timestamp ) {
	        article.timestamp = pb.content.getTimestampTextFromSettings(
	        		article.publish_date,
	        		contentSettings
			);
	    }

		// No need to cutoff article if there's only 1
		if(articleCount > 1 && contentSettings.auto_break_articles) {
			var breakString = '<br>';
			var tempLayout;

			// Firefox uses br and Chrome uses div in content editables.
			// We need to see which one is being used
			var brIndex = article.article_layout.indexOf('<br>');
			if(brIndex === -1) {
				brIndex = article.article_layout.indexOf('<br />');
				breakString = '<br />';
			}
			var divIndex = article.article_layout.indexOf('</div>');

			// Temporarily replace double breaks with a directive so we don't mess up the count
			if(divIndex === -1 || (brIndex > -1 && divIndex > -1 && brIndex < divIndex)) {
				tempLayout = article.article_layout.split(breakString + breakString).join(breakString + '^dbl_pgf_break^');
			}
			else {
				breakString = '</div>';
				tempLayout = article.article_layout.split('<div><br></div>').join(breakString + '^dbl_pgf_break^')
				.split('<div><br /></div>').join(breakString + '^dbl_pgf_break^');
			}

			// Split the layout by paragraphs and remove any empty indices
			var tempLayoutArray = tempLayout.split(breakString);
			for(var i = 0; i < tempLayoutArray.length; i++) {
				if(!tempLayoutArray[i].length) {
					tempLayoutArray.splice(i, 1);
					i--;
				}
			}

			// Only continue if we have more than 1 paragraph
			if(tempLayoutArray.length > 1) {
				var newLayout = '';

				// Cutoff the article at the right number of paragraphs
				for(i = 0; i < tempLayoutArray.length && i < contentSettings.auto_break_articles; i++) {
					if(i === contentSettings.auto_break_articles -1 && i != tempLayoutArray.length - 1) {
						newLayout += tempLayoutArray[i] + '&nbsp;<a href="' + pb.config.siteRoot + '/article/' + article.url + '">' + contentSettings.read_more_text + '...</a>' + breakString;
						continue;
					}
					newLayout += tempLayoutArray[i] + breakString;
				}

				if(breakString === '</div>') {
					breakString = '<div><br /></div>';
				}

				// Replace the double breaks
				newLayout = newLayout.split('^dbl_pgf_break^').join(breakString);

				article.article_layout = newLayout;
			}
		}
	}

    article.layout  = article.article_layout;
    var mediaLoader = new MediaLoader();
    mediaLoader.start(article[this.getContentType()+'_layout'], function(err, newLayout) {
        article.layout = newLayout;
        delete article.article_layout;

        if (self.getContentType() === 'article') {

        	var where = {article: article._id.toString()};
	        var order = {created: pb.DAO.ASC};
	        var dao   = new pb.DAO();
	        dao.q('comment', {where: where, select: pb.DAO.PROJECT_ALL, order: order}, function(err, comments) {
	            if(util.isError(err) || comments.length == 0) {
	                return cb(null, null);
	            }

	            self.getCommenters(comments, contentSettings, function(err, commentsWithCommenters) {
	                article.comments = commentsWithCommenters;
	                cb(null, null);
	            });
	        });
        }
        else {
        	cb(null, null);
        }
    });
};

/**
 * Retrieves the authors of an array of articles
 *
 * @method getArticleAuthors
 * @param {Array}    articles Array of article objects
 * @param {Function} cb       Callback function
 */
ArticleService.prototype.getArticleAuthors = function(articles, cb) {

	//gather all author IDs
	var dao = new pb.DAO();
	dao.q('user', {where: pb.DAO.getIDInWhere(articles, 'author')}, cb);
};

/**
 * Retrieves the commenters for an array of comments
 *
 * @method getCommenters
 * @param {Array}    comments        Array of comment objects
 * @param {Object}   contentSettings Content settings to use for processing
 * @param {Function} cb              Callback function
 */
ArticleService.prototype.getCommenters = function(comments, contentSettings, cb) {

	//callback for iteration to handle setting the commenter attributes
    var processComment = function(comment, commenter) {
    	comment.commenter_name = 'Anonymous';
    	comment.timestamp      = pb.content.getTimestampTextFromSettings(comment.created, contentSettings);

    	if (commenter) {
	    	comment.commenter_name = pb.users.getFormattedName(commenter);
	        if(commenter.photo) {
	        	comment.commenter_photo = commenter.photo;
	        }
	        if(commenter.position) {
	        	comment.commenter_position = commenter.position;
	        }
    	}
    };

    var processedComments = [];
    var users             = {};
    var tasks             = pb.utils.getTasks(comments, function(comments, i) {
    	return function(callback) {

    		var comment   = comments[i];
    		if (!comment.commenter || users[comment.commenter]) {

    			//user already commented so pull locally
    			processComment(comment, users[comment.commenter]);
    			processedComments.push(comment);
    			callback(null, true);
    			return;
    		}

    		//user has not already commented so load
    		var dao = new pb.DAO();
    	    dao.loadById(comment.commenter, 'user', function(err, commenter) {
    	        if(util.isError(err) || commenter == null) {
    	        	callback(null, false);
    	            return;
    	        }

    	        //process the comment
    	        users[commenter._id.toString()] = commenter;
    	        processComment(comment, commenter);
    			processedComments.push(comment);

    			callback(null, true);
    	    });
    	};
    });
    async.series(tasks, function(err, result) {
    	cb(err, processedComments);
    });
};

/**
 * Retrieves the article and byline templates
 *
 * @method getTemplates
 * @param {Function} cb Callback function
 */
ArticleService.prototype.getTemplates = function(cb) {
	var ts = new pb.TemplateService();
    ts.load('elements/article', function(err, articleTemplate) {
        ts.load('elements/article/byline', function(err, bylineTemplate) {
            cb(articleTemplate, bylineTemplate);
        });
    });
};

/**
 * Retrieves the meta info for an article or page
 *
 * @method getMetaInfo
 * @param {Object}   article An article or page object
 * @param {Function} cb      Callback function
 */
ArticleService.getMetaInfo = function(article, cb)
{
    if(typeof article === 'undefined')
    {
        cb('', '', '');
        return;
    }

    var keywords = article.meta_keywords || [];
    var topics = article.article_topics || article.page_topics || [];
	var thumbnail = '';
    var instance = this;
	var dao = new pb.DAO();

    this.loadTopic = function(index)
    {
        if(index >= topics.length)
        {
            var description = '';
            if(article.meta_desc)
            {
                description = article.meta_desc;
            }
            else if(article.layout)
            {
                description = article.layout.replace(/<\/?[^>]+(>|$)/g, '').substr(0, 155);
            }

            cb(keywords.join(','), description, (article.seo_title) ? article.seo_title : article.headline, thumbnail);
            return;
        }

        dao.loadById(topics[index], 'topic', function(err, topic) {
            if(util.isError(err) || !topic) {
                pb.log.error('ArticleService: Failed to load topic. %s', err.stack);

                index++;
                instance.loadTopic(index);
                return;
            }

            var topicName = topic.name;
            var keywordMatch = false;

            for(var i = 0; i < keywords.length; i++) {
                if(topicName == keywords[i]) {
                    keywordMatch = true;
                    break;
                }
            }

            if(!keywordMatch)
            {
                keywords.push(topicName);
            }
            index++;
            instance.loadTopic(index);
        });
    };

	if(!article.thumbnail || !article.thumbnail.length) {
		this.loadTopic(0);
	}
	else {
		dao.loadById(article.thumbnail, 'media', function(err, media) {
			if(util.isError(err) || !media) {
				instance.loadTopic(0);
				return;
			}

			thumbnail = media.location;
			instance.loadTopic(0);
		});
	}
};

/**
 * Handles retrieval and injection of media in articles and pages
 *
 * @module Services
 * @class MediaLoader
 * @constructor
 * @submodule Entities
 */
function MediaLoader() {};

/**
 * Processes an article or page to insert media
 *
 * @method start
 * @param  {String}   articleLayout The HTML layout of the article or page
 * @param  {Function} cb            [description]
 */
MediaLoader.prototype.start = function(articleLayout, cb) {
	var self = this;
	var ts   = new pb.TemplateService();
    ts.load('elements/media', function(err, mediaTemplate) {

    	async.whilst(
			function() {return articleLayout.indexOf('^media_display_') >= 0;},
			function(callback) {
				self.replaceMediaTag(articleLayout, mediaTemplate, function(err, newArticleLayout) {
					articleLayout = newArticleLayout;
					callback();
				});
			},
			function(err) {
				cb(err, articleLayout);
			}
		);
    });
};

/**
 * Replaces an article or page layout's ^media_display^ tag with a media embed
 * @param {String}   layout        The HTML layout of the article or page
 * @param {String}   mediaTemplate The template of the media embed
 * @param {Function} cb            Callback function
 */
MediaLoader.prototype.replaceMediaTag = function(layout, mediaTemplate, cb) {
	var flag = pb.MediaService.extractNextMediaFlag(layout);
    if (!flag) {
        return cb(null, layout);
    }

    var mediaStyleString = flag.style;

    var dao = new pb.DAO();
    dao.loadById(flag.id, 'media', function(err, data) {
        if(util.isError(err)) {
            return cb(err);
        }
        else if (!data) {
            pb.log.warn("ArticleService: Content contains reference to missing media [%s].", flag.id);
            return cb(null, layout.replace(flag.flag, ''));
        }

        //ensure the max height is set if explicity set for media replacement
        var options = {
            view: 'post',
            style: {

            },
            attrs: {
                frameborder: "0",
                allowfullscreen: ""
            }
        };
        if (flag.style.maxHeight) {
            options.style['max-height'] = flag.style.maxHeight;
        }
        var ms = new pb.MediaService();
        ms.render(data, options, function(err, html) {
            if (util.isError(err)) {
                return cb(err);
            }

            //get the style for the container
            var containerStyleStr = pb.MediaService.getStyleForPosition(flag.style.position) || '';

            //finish up replacements
            var mediaEmbed = mediaTemplate.split('^media^').join(html);
            mediaEmbed     = mediaEmbed.split('^caption^').join(data.caption);
            mediaEmbed     = mediaEmbed.split('^display_caption^').join(data.caption ? '' : 'display: none');
            mediaEmbed     = mediaEmbed.split('^container_style^').join(containerStyleStr);
            cb(null, layout.replace(flag.flag, mediaEmbed));
        });
    });
};

//exports
module.exports.ArticleService = ArticleService;
module.exports.MediaLoader    = MediaLoader;
