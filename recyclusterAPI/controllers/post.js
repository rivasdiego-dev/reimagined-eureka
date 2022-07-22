const PostModel = require("../models/post");
const UserModel = require("../models/user");
const { image_requirements } = require("../utils/imageRequirements");
const fs = require('fs');

const { getObjId, validId } = require("../utils/generalFunctions");
const { POST_OMIT, USER_OMIT } = require('../utils/ommit');

const deleteImage = (path) => {
    fs.unlink(path, (err) => {
        if (err) console.log('Error deleting ' + path);;
        console.log(path + ' was deleted');
    });
}

// PAGINATION
const p_limit = 10;

// FLAGS
const VISIBLE = 1;
const HIDDEN = 2;

const UNBLOCKED = 1;
const BLOCKED = 2;

// Get post's owner (user) as Promise
const getPostsUsersPromises = async (posts) => {
    let users = [];

    posts.forEach(post => {
        let user = UserModel.findOne({ _id: post.user_id }, USER_OMIT);
        users.push(user);
    });

    return users;
}

/**
 * Get all posts and its ownsers information without pagination
 * 
 */
exports.getAllNoPagination = async (req, res, next) => {
    try {
        let searchParams = { visibility: VISIBLE, status: UNBLOCKED };
        let posts = await PostModel.find(searchParams, POST_OMIT).sort({ createdAt: -1 });

        // Get post's owners info
        let users = await getPostsUsersPromises(posts);

        let response = [];

        Promise.all(users).then((values) => {
            // Build response with posts and users
            posts.forEach((post, index) => {
                response.push({ post, user: values[index] });
            });
    
            res.send({
                ok: true,
                count: posts.length,
                posts: response
            });
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all posts and its ownsers information with pagination
 * 
 */
exports.getAll = async (req, res, next) => {
    try {
        let page = parseInt(req.params.page ?? 1);
        let p_number = (p_limit * page) - p_limit;

        let searchParams = { visibility: VISIBLE, status: UNBLOCKED };

        let total = await PostModel.count(searchParams);
        let totalPages = Math.ceil(total / p_limit);

        let posts = await PostModel.find(searchParams, POST_OMIT).skip(p_number).limit(p_limit);

        // Get post's owners info
        let users = await getPostsUsersPromises(posts);

        let response = [];

        Promise.all(users).then((values) => {
            // Build response with posts and users
            posts.forEach((post, index) => {
                response.push({ post, user: values[index] });
            });
    
            res.send({
                ok: true,
                page: page,
                pages: totalPages,
                count: posts.length,
                posts: response
            });
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get post by id
 *
 */
exports.getPost = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let post = await PostModel.findOne({ _id }, POST_OMIT);

        if (!post) 
            return res.status(404).send({
                ok: false,
                message: "post not found",
            });

        // Get post owner info
        let user = await UserModel.findOne({ _id: post.user_id }, USER_OMIT);

        res.send({ 
            ok: true,
            post: post,
            user: user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get post by users id
 *
 */
exports.getPostsByUser = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let posts = await PostModel.find({ user_id: _id }, POST_OMIT).sort({ createdAt: -1 });

        if (!posts) 
            return res.status(404).send({
                ok: false,
                message: "No posts found"
            });

        // Get post's owners info
        let users = await getPostsUsersPromises(posts);

        let response = [];
        Promise.all(users).then((values) => {
            // Build response with posts and users
            posts.forEach((post, index) => {
                response.push({ post, user: values[index] });
            });
    
            res.send({
                ok: true,
                count: posts.length,
                posts: response
            });
        });
    } catch (err) {
        next(err);
    }
};

// Function used by the system to verify a relationship
// before creating it
exports.existsPost = async (_id) => {
    try {
        if (!validId(_id)) 
            return false; 

        let post = await PostModel.exists({ _id });

        if (!post) 
            return false;

        return true;
    } catch (err) {
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        let { title, description, category } = req.body;

        if (!req.file)
            return res.status(400).send({
                ok: false, 
                message: "Image is required",
                requirements: image_requirements
            });

        // get route from saved image
        let image = req.file.destination + '/' + req.file.filename;

        if (!image)
            return res.status(400).send({ok: false, message: "Image is required"});
        if (!title) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Title is required"});
        }
        if (!description) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Description is required"});
        }
        if (!category) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Category is required"});
        }

        let newPost = await PostModel.create({ 
            user_id: getObjId(req.user._id),
            title, 
            description, 
            category, 
            image 
        });

        res.send({ 
            ok: true,
            post: newPost
         });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        let _id = req.params._id;
        let { title, description, category } = req.body;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let post = await PostModel.findOne({ _id });

        if (!post)
            return res.status(404).send({
                ok: false,
                message: "Post to update not found",
            });

        // Verify post ownership
        if (getObjId(req.user._id) !== post.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This post is not from your ownership",
            });
        }

        // The post to update was found
        // Validate new post information
        if (!req.file)
            return res.status(400).send({
                ok: false, 
                message: "Image is required",
                requirements: image_requirements
            });

        // get route from saved image
        let image = req.file.destination + '/' + req.file.filename;
        
        if (!image)
            return res.status(400).send({ok: false, message: "Image is required"});
        if (!title) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Title is required"});
        }
        if (!description) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Description is required"});
        }
        if (!category) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Category is required"});
        }

        let oldPost = { 
            title: post.title,
            description: post.description,
            category: post.category,
            image: post.image
        };

        // add old post to history
        let newHistory = [ ...post.history, oldPost ]

        let updated = await PostModel.updateOne(
            { _id },
            {
                title, 
                description, 
                category,
                image,
                history: newHistory
            }
        );

        // get updated post from DB
        post = await PostModel.findOne({ _id }, POST_OMIT);

        if (updated.acknowledged && post) {
            return res.send({
              ok: true,
              message: "Post is updated",
              post: post,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot update post",
        });
    } catch (err) {
        next(err);
    }
};

exports.changePostVisibility = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let post = await PostModel.findOne({ _id });

        if (!post)
            return res.status(404).send({
                ok: false,
                message: "Post to update not found",
            });

        // Verify post ownership
        if (getObjId(req.user._id) !== post.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This post is not from your ownership",
            });
        }

        // Change visibility
        visibility = (post.visibility == VISIBLE) ? HIDDEN : VISIBLE; 

        let updated = await PostModel.updateOne(
            { _id },
            { visibility }
        );

        if (updated.acknowledged) {
            return res.send({
              ok: true,
              message: "Post is visibility updated",
              visibility: visibility,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot update post visibility",
        });
    } catch (err) {
        next(err);
    }
};

// Function used by admins to block nasty posts
exports.changePostStatus = async (_id) => {
    try {
        if (!validId(_id)) 
            return {
                ok: false,
                message: "Invalid id",
            }; 

        let post = await PostModel.findOne({ _id });

        if (!post)
            return {
                ok: false,
                message: "Post to update not found",
            };

        // Change status
        newStatus = (post.status == UNBLOCKED) ? BLOCKED : UNBLOCKED; 

        let updated = await PostModel.updateOne(
            { _id },
            { status: newStatus }
        );

        if (updated.acknowledged) {
            return {
              ok: true,
              message: "Post status updated",
              newStatus: newStatus,
              info: updated
            };
        }
      
        return {
            ok: false,
            message: "cannot update post visibility",
        };
    } catch (err) {
        return {
            ok: false,
            message: "Something went wrong",
        };
    }
};

exports.deletePost = async (req, res, next) => {
    // TODO: this action may only be done by the system itself
    // so it will not be access from routes
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let post = await PostModel.findOne({ _id });

        if (!post) 
            return res.status(404).send({
                ok: false,
                message: "No post found"
            });

        // Verify post ownership
        if (getObjId(req.user._id) !== post.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This post is not from your ownership",
            });
        }

        let { deletedCount } = await PostModel.deleteOne({ _id });

        if (deletedCount == 1) {
            deleteImage(post.image);
            return res.send({
                ok: true,
                message: "post successfully deleted",
            });
        }
        return res.status(400).send({
            ok: false,
            message: "cannot delete post, maybe it was delete before",
        });
    } catch (err) {
        next(err);
    }
};

exports.deletePosts = async (req, res, next) => {
    // TODO: This method will not be published since we are not deleting users
    // METHOD id temporary to dev porpouses
    try {
  
      let deleted = await PostModel.deleteMany({ });
  
      if (deleted) {
        return res.send({
          ok: true,
          deleted: deleted,
          message: "successfully deleted",
        });
      }
  
      return res.status(400).send({
        ok: false,
        message: "cannot delete posts",
      });
    } catch (err) {
      next(err);
    }
};