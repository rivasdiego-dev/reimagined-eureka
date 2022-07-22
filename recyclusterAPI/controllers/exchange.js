const ExchangeModel = require("../models/exchange");
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const { image_requirements } = require("../utils/imageRequirements");
const fs = require('fs');
var { updateUserPoints } = require("./user");
var { existsPost } = require("./post");

const { getObjId, validId } = require("../utils/generalFunctions");
const { EXC_OMIT, POST_OMIT, USER_OMIT } = require('../utils/ommit');

// Point to be assigned
const pointsChallenge = 500;
const pointsLikes = 100;

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
const NEW = 1;
const DENIED = 2;
const ACCEPTED = 3;
const COMPLETE = 4;

// Get exchange's owner (user) as Promise
const getExchangeUsersPromises = async (exchanges) => {
    let users = [];

    exchanges.forEach(exchange => {
        let user = UserModel.findOne({ _id: exchange.user_id }, USER_OMIT);
        users.push(user);
    });

    return users;
}

/**
 * Get all exchanges without pagination
 * 
 */
 exports.getAllNoPagination = async (req, res, next) => {
    try {
        let searchParams = { visibility: VISIBLE, status: COMPLETE };
        let exchanges = await ExchangeModel.find(searchParams, EXC_OMIT).sort({ createdAt: -1 });

        // Get exchange's owners info
        let users = await getExchangeUsersPromises(exchanges);

        let response = [];

        Promise.all(users).then((values) => {
            // Build response with exchanges and users
            exchanges.forEach((exchange, index) => {
                response.push({ exchange, user: values[index] });
            });
    
            res.send({
                ok: true,
                count: exchanges.length,
                exchanges: response,
            });
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all exchanges with pagination
 * 
 */
exports.getAll = async (req, res, next) => {
    try {
        let page = parseInt(req.params.page ?? 1);
        let p_number = (p_limit * page) - p_limit;

        let searchParams = { visibility: VISIBLE, status: COMPLETE };

        let total = await ExchangeModel.count(searchParams);
        let totalPages = Math.ceil(total / p_limit);

        let exchanges = await ExchangeModel.find(searchParams, EXC_OMIT).skip(p_number).limit(p_limit);

        // Get exchange's owners info
        let users = await getExchangeUsersPromises(exchanges);

        let response = [];

        Promise.all(users).then((values) => {
            // Build response with exchanges and users
            exchanges.forEach((exchange, index) => {
                response.push({ exchange, user: values[index] });
            });
    
            res.send({
                ok: true,
                page: page,
                pages: totalPages,
                count: exchanges.length,
                exchanges: response,
            });
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get exchange by id
 *
 */
exports.getExchange = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id }, EXC_OMIT);

        if (!exchange) 
            return res.status(404).send({
                ok: false,
                message: "exchange not found",
            });

        let user = await UserModel.findOne({ _id: exchange.user_id }, USER_OMIT);
        let post = await PostModel.findOne({ _id: exchange.post_id }, POST_OMIT);

        res.send({ 
            ok: true,
            exchange,
            post,
            user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get exchanges by users id
 *
 */
 exports.getExchangesByUser = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchanges = await ExchangeModel.find({ user_id: _id }, EXC_OMIT).sort({ createdAt: -1 });

        if (!exchanges) 
            return res.status(404).send({
                ok: false,
                message: "No exchanges found"
            });

        res.send({ 
            ok: true,
            count: exchanges.length,
            exchanges: exchanges
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get exchanges by post id
 *
 */
 exports.getExchangesByPost = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchanges = await ExchangeModel.find({ post_id: _id }, EXC_OMIT).sort({ createdAt: -1 });

        if (!exchanges) 
            return res.status(404).send({
                ok: false,
                message: "No exchanges found"
            });

        res.send({ 
            ok: true,
            count: exchanges.length,
            exchanges: exchanges
        });
    } catch (err) {
        next(err);
    }
};

// Function used by the system to verify a relationship
// before creating it
exports.existsExchange = async (_id) => {
    try {
        if (!validId(_id)) 
            return false; 

        let exchange = await ExchangeModel.exists({ _id });

        if (!exchange) 
            return false;

        return true;
    } catch (err) {
        next(err);
    }
};

exports.createExchange = async (req, res, next) => {
    // This is for new exchange requests
    try {
        let { post_id, req_description } = req.body;

        if (!post_id) 
            return res.status(400).send({ok: false, message: "Post id is required"});
        if (!req_description) 
            return res.status(400).send({ok: false, message: "Request description is required"});
        
        let postExists = await existsPost(post_id);
        if (!postExists) 
            return res.status(400).send({ok: false, message: "Ref post does not exists"});

        let newExchange = await ExchangeModel.create({ 
            post_id,
            user_id: getObjId(req.user._id),
            req_description
        });

        res.send({ 
            ok: true,
            exchange: newExchange
         });
    } catch (err) {
        next(err);
    }
};

exports.completeExchange = async (req, res, next) => {
    try {
        let _id = req.params._id;
        let { title, description, materials, steps  } = req.body;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange)
            return res.status(404).send({
                ok: false,
                message: "Exchange to update not found",
            });

        // Verify exchange ownership
        if (getObjId(req.user._id) !== exchange.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This exchange is not from your ownership",
            });
        }

        // The exchange to update was found
        // Validate new exchange information
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
        if (!materials) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Materials is required"});
        }
        if (!steps) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Steps is required"});
        }

        let updated = await ExchangeModel.updateOne(
            { _id },
            {
                title, 
                description, 
                materials,
                steps,
                image,
                status: COMPLETE
            }
        );

        // get updated post from DB
        exchange = await ExchangeModel.findOne({ _id }, EXC_OMIT);

        if (updated.acknowledged && exchange) {
            // Assign points to user
            let response = await updateUserPoints(exchange.user_id, pointsChallenge);

            return res.send({
              ok: true,
              message: "Exchange is completed",
              exchange: exchange,
              pointsAssigned: response.ok,
              pointsMessage: response.message,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot complete exchange",
        });
    } catch (err) {
        next(err);
    }
};

exports.aproveExchange = async (req, res, next) => {
    try {
        let _id = req.params._id;
        let { status } = req.body;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange)
        return res.status(404).send({
            ok: false,
            message: "Exchange to update not found",
        });
        
        let post = await PostModel.findOne({ _id: exchange.post_id });

        // Verify exchange's post ownership
        if (getObjId(req.user._id) !== post.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This post is not from your ownership",
            });
        }

        if (!status)
            return res.status(400).send({ok: false, message: "Status is required"});
        if (status != DENIED && status != ACCEPTED)
            return res.status(400).send({ok: false, message: "Status must be [2, 3]"});

        let updated = await ExchangeModel.updateOne(
            { _id },
            { status }
        );

        // get updated post from DB
        exchange = await ExchangeModel.findOne({ _id }, EXC_OMIT);

        let success_message = (status == ACCEPTED) ? "Exchange accepted" : "Exchange denied";

        if (updated.acknowledged && exchange) {
            return res.send({
              ok: true,
              message: success_message,
              exchange: exchange,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot update exchange status",
        });

    } catch (err) {
        next(err);
    }
};

// Tmp function to test retrofit
exports.exampleExchange = async (req, res, next) => {
        try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        /* v1
        let exchange = await ExchangeModel.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "post_id",
                    foreignField: "id",
                    as: "post"
                }
            }
        ]);
        */

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange)
        return res.status(404).send({
            ok: false,
            message: "Exchange to update not found",
        });
        
        let post = await PostModel.findOne({ _id: exchange.post_id });

        res.send({ 
            ok: true,
            exchange, 
            post
        });
    } catch (err) {
        next(err);
    }
};

exports.updateExchange = async (req, res, next) => {
    // Update only for completed exchanges
    try {
        let _id = req.params._id;
        let { title, description, materials, steps } = req.body;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange)
            return res.status(404).send({
                ok: false,
                message: "Exchange to update not found",
            });

        // Verify exchange ownership
        if (getObjId(req.user._id) !== exchange.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This exchange is not from your ownership",
            });
        }

        // Verify its a completed exchange
        if (exchange.status !== COMPLETE) {
            return res.status(400).send({
                ok: false, 
                message: "This is not an completed exchange"
            });
        }

        // The exchange to update was found
        // Validate new exchange information
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
        if (!materials) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Materials is required"});
        }
        if (!steps) {
            deleteImage(image);
            return res.status(400).send({ok: false, message: "Steps is required"});
        }

        let oldExchange = { 
            title: exchange.title,
            description: exchange.description,
            materials: exchange.materials,
            steps: exchange.steps,
            image: exchange.image
        };

        // add old exchange to history
        let newHistory = [ ...exchange.history, oldExchange ]

        let updated = await ExchangeModel.updateOne(
            { _id },
            {
                title, 
                description, 
                materials,
                steps,
                image,
                history: newHistory
            }
        );

        // get updated post from DB
        exchange = await ExchangeModel.findOne({ _id }, EXC_OMIT);

        if (updated.acknowledged && exchange) {
            return res.send({
              ok: true,
              message: "Exchange is updated",
              exchange: exchange,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot update exchange",
        });
    } catch (err) {
        next(err);
    }
};

exports.likeExchange = async (req, res, next) => {
    // Likes only for completed exchanges
    try {
        let _id = req.params._id;
        let like = getObjId(req.user._id);

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange)
            return res.status(404).send({
                ok: false,
                message: "Exchange to update not found",
            });

        // Verify its a completed exchange
        if (exchange.status !== COMPLETE) {
            return res.status(400).send({
                ok: false, 
                message: "This is not an completed exchange"
            });
        }

        // Check if add or remove like
        let likes = [];
        let assign = false;

        if (exchange.likes.includes(like)) {
            likes = exchange.likes.filter((element) => {
                element !== like;
            });
        } else {
            // add old exchange to history
            likes = [ ...exchange.likes, like ]
            assign = true;
        }

        let updated = await ExchangeModel.updateOne(
            { _id },
            { likes }
        );

        if (updated.acknowledged) {
            let response = {};
            if (assign) {
                // Assign points to user
                response = await updateUserPoints(exchange.user_id, pointsLikes);
            } else {
                // Remove points from user
                response = await updateUserPoints(exchange.user_id, -pointsLikes);
            }

            return res.send({
              ok: true,
              message: "Added new like",
              likes: likes,
              pointsAssigned: response.ok,
              pointsMessage: response.message,
              info: updated
            });
        }
      
        res.status(400).send({
            ok: false,
            message: "cannot update exchange likes",
        });
    } catch (err) {
        next(err);
    }
};

exports.countExchanges = async (req, res, next) => {
    try {
      let countExchanges = await ExchangeModel.count({});
  
      res.send({ 
        ok: true,
        count: countExchanges 
      });
    } catch (err) {
      next(err);
    }
};


exports.deleteExchange = async (req, res, next) => {
    // TODO: this action may only be done by the system itself
    // so it will not be access from routes
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let exchange = await ExchangeModel.findOne({ _id });

        if (!exchange) 
            return res.status(404).send({
                ok: false,
                message: "No exchange found"
            });

        // Verify exchange ownership
        if (getObjId(req.user._id) !== exchange.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This exchange is not from your ownership",
            });
        }

        let { deletedCount } = await ExchangeModel.deleteOne({ _id });

        if (deletedCount == 1) {
            deleteImage(exchange.image);
            return res.send({
                ok: true,
                message: "exchange successfully deleted",
            });
        }
        return res.status(400).send({
            ok: false,
            message: "cannot delete exchange, maybe it was delete before",
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteExchanges = async (req, res, next) => {
    // TODO: This method will not be published since we are not deleting users
    // METHOD id temporary to dev porpouses
    try {
  
      let deleted = await ExchangeModel.deleteMany({ });
  
      if (deleted) {
        return res.send({
          ok: true,
          deleted: deleted,
          message: "successfully deleted",
        });
      }
  
      return res.status(400).send({
        ok: false,
        message: "cannot delete exchanges",
      });
    } catch (err) {
      next(err);
    }
};