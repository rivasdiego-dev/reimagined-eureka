const ReportModel = require("../models/report");
const PostModel = require("../models/post");
const ExchangeModel = require("../models/exchange");
const UserModel = require("../models/user");

var { existsPost } = require("./post");
var { existsExchange } = require("./exchange");

const { getObjId, validId } = require("../utils/generalFunctions");
const { EXC_OMIT, POST_OMIT, USER_OMIT, REPORT_OMIT } = require('../utils/ommit');

// PAGINATION
const p_limit = 10;

// FLAGS
const NEW = 1;
const CLOSED = 2;
const VALID_STATUS = [NEW, CLOSED];

// Get reports's owner (user) as Promise
const getReportsUsersPromises = async (reports) => {
    let users = [];

    reports.forEach(report => {
        let user = UserModel.findOne({ _id: report.user_id }, USER_OMIT);
        users.push(user);
    });

    return users;
}

/**
 * Get all reports
 * 
 */
exports.getAll = async (req, res, next) => {
    try {
        let page = parseInt(req.params.page ?? 1);
        let p_number = (p_limit * page) - p_limit;

        let searchParams = { status: NEW };

        let total = await ReportModel.count(searchParams);
        let totalPages = Math.ceil(total / p_limit);

        let reports = await ReportModel.find(searchParams, REPORT_OMIT).skip(p_number).limit(p_limit);

        // Get post's owners info
        let users = await getReportsUsersPromises(reports);

        let response = [];
        
        Promise.all(users).then((values) => {
            // Build response with reports and users
            reports.forEach((report, index) => {
                response.push({ report, user: values[index] });
            });
    
            res.send({
                ok: true,
                page: page,
                pages: totalPages,
                count: reports.length,
                reports: response
            });
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get report by id
 *
 */
exports.getReport = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let report = await ReportModel.findOne({ _id }, REPORT_OMIT);

        if (!report) 
            return res.status(404).send({
                ok: false,
                message: "report not found",
            });

        let user = await UserModel.findOne({ _id: report.user_id }, USER_OMIT);
        let post = await PostModel.findOne({ _id: report.target_id }, POST_OMIT);
        let exchange = await ExchangeModel.findOne({ _id: report.target_id }, EXC_OMIT);

        // Find reported user in target (post or exchange)
        let reported_user = post?.user_id ?? exchange?.user_id;
        reported_user = await UserModel.findOne({ _id: reported_user }, USER_OMIT);

        res.send({ 
            ok: true,
            report,
            user,
            reported_user,
            post,
            exchange
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get report by target id
 *
 */
 exports.getReportsByTarget = async (req, res, next) => {
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let reports = await ReportModel.find({ target_id: _id }, REPORT_OMIT);

        if (!reports) 
            return res.status(404).send({
                ok: false,
                message: "No reports found"
            });

        res.send({ 
            ok: true,
            count: reports.length,
            reports: reports
        });
    } catch (err) {
        next(err);
    }
};

exports.createReport = async (req, res, next) => {
    try {
        let { target_id, reason } = req.body;

        if (!target_id)
            return res.status(400).send({ok: false, message: "Target id is required"});
        if (!reason) 
            return res.status(400).send({ok: false, message: "Reason is required"});

        let postExists = await existsPost(target_id);
        let exchangeExists = await existsExchange(target_id);
        if (!postExists && !exchangeExists) 
            return res.status(400).send({ok: false, message: "Target post or exchange does not exists"});

        // Verify if report already exists
        let report = await ReportModel.findOne({ target_id: target_id, reason: reason });

        if (!report) {
            // Create new report
            let newReport = await ReportModel.create({ 
                target_id,
                user_id: getObjId(req.user._id),
                reason
            });
    
            res.send({ 
                ok: true,
                message: "Report added",
                report: newReport
            });
        } else {
            // As report exists add a new contributor
            // Check if add to frequency or already exists
            let register = getObjId(req.user._id);

            if (report.frequency.includes(register) || report.user_id == register) {
                return res.send({ 
                    ok: true,
                    message: "Report already exists",
                    report: report
                });
            } 

            let updated = await ReportModel.updateOne(
                { _id: report._id },
                {
                    frequency: [ ...report.frequency, register ]
                }
            );
    
            // get updated report from DB
            report = await ReportModel.findOne({ _id: report._id });
    
            if (updated.acknowledged && report) {
                return res.send({
                  ok: true,
                  message: "Report added",
                  report: report,
                  info: updated
                });
            }
          
            res.status(400).send({
                ok: false,
                message: "cannot update report",
            });
        }
    } catch (err) {
        next(err);
    }
};

exports.updateReportStatus = async (req, res, next) => {
    try {
        let _id = req.params._id;
        let { status } = req.body;


        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        if (!status)
            return res.status(400).send({ok: false, message: "New status is required"});
        if (!VALID_STATUS.includes(status))
            return res.status(400).send({ok: false, message: "Invalid new status, muste be [1, 2]"});

        let report = await ReportModel.findOne({ _id });

        if (!report) 
            return res.status(404).send({
                ok: false,
                message: "No report found"
            });

        let updated = await ReportModel.updateOne(
            { _id },
            { status }
        );

        // get updated report from DB
        report = await ReportModel.findOne({ _id });

        if (updated.acknowledged && report) {
            return res.send({
                ok: true,
                message: "Report status updated",
                report: report,
                info: updated
            });
        }
        
        res.status(400).send({
            ok: false,
            message: "cannot update report",
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteReport = async (req, res, next) => {
    // TODO: this action may only be done by the system itself
    // so it will not be access from routes
    try {
        let _id = req.params._id;

        if (!validId(_id)) 
            return res.status(400).send({
                ok: false,
                message: "Invalid id",
            }); 

        let report = await ReportModel.findOne({ _id });

        if (!report) 
            return res.status(404).send({
                ok: false,
                message: "No report found"
            });

        // Verify report ownership
        if (getObjId(req.user._id) !== report.user_id) {
            return res.status(400).send({
                ok: false,
                message: "This report is not from your ownership",
            });
        }

        let { deletedCount } = await ReportModel.deleteOne({ _id });

        if (deletedCount == 1) {
            return res.send({
                ok: true,
                message: "report successfully deleted",
            });
        }
        return res.status(400).send({
            ok: false,
            message: "cannot delete report, maybe it was delete before",
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteReports = async (req, res, next) => {
    // TODO: This method will not be published since we are not deleting users
    // METHOD id temporary to dev porpouses
    try {
  
      let deleted = await ReportModel.deleteMany({ });
  
      if (deleted) {
        return res.send({
          ok: true,
          deleted: deleted,
          message: "successfully deleted",
        });
      }
  
      return res.status(400).send({
        ok: false,
        message: "cannot delete reports",
      });
    } catch (err) {
      next(err);
    }
};