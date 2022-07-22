const ExchangeModel = require("../models/exchange");
const PostModel = require("../models/post");

// FLAGS (EXCHANGE)
const COMPLETE = 4;

const getCurrentDate = () => {
    const today = new Date();
    return dateToString(today);
}

const getSomeDays = (days = 6) => {
    let tmp_today = new Date();
    let dates = [];

    for (let i = 0; i < days; i++) {
        yesterday = getTheDayBefore(tmp_today);
        dates.push([ dateToString(tmp_today), dateToString(yesterday) ]);
        tmp_today = yesterday;
    }

    return dates;
}

const getMonthInteval = (days = 6) => {
    let today = new Date();
   
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    let start = `${year}-${month}-1`;
    let end = `${year}-${month + 1}-1`;

    return [start, end];
}

const getTheDayBefore = (date, days = 1) => {
    let yesterday = new Date();
    yesterday.setDate(date.getDate() - days);

    return yesterday;
}

const dateToString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${year}-${month}-${day}`;
}

// Get post count by day
const postsByDay = async (day, nextDay) => {
    let count = PostModel.count({ createdAt: { $gte: day, $lt: nextDay } });
    console.log(`Days: ${day}, ${nextDay}`);
    return count ?? 0;
}

// Get exchanges count by day 
const exchangesByDay = async (day, nextDay) => {
    let count = ExchangeModel.count({ createdAt: { $gte: day, $lt: nextDay } });
    return count ?? 0;
}

/* TEST
let day1 = new Date("2022-06-13").toISOString();
let day2 = new Date("2022-06-14").toISOString();

let postToday = await PostModel.find({ createdAt: { $gte: day1, $lt: day2 } }, POST_OMIT);
*/

/**
 * Get today and last 5 days stats
 * And get stats by week and month 
 * 
 */
exports.getAll = async (req, res, next) => {
    try {
        // Get weekly data
        let today = new Date();
        let current = getCurrentDate(); // returns string

        let weekBefore = dateToString(getTheDayBefore(today, 7));

        let weeklyPosts = await postsByDay(weekBefore, current);
        let weeklyExchanges = await exchangesByDay(weekBefore, current);

        // Get monthly data
        let [month_start, month_end] = getMonthInteval(); // returns strings

        let monthlyPosts = await postsByDay(month_start, month_end);
        let monthlyExchanges = await exchangesByDay(month_start, month_end);

        // Get stats from the last 6 days
        let dates = getSomeDays();

        let days = dates.map(x => x[0]);
        let posts = [];
        let exchanges = [];
        
        for (let i = 0; i < dates.length; i++) {
            posts.push(postsByDay(dates[i][0], dates[i][1]));
        }
        for (let i = 0; i < dates.length; i++) {
            exchanges.push(exchangesByDay(dates[i][0], dates[i][1]));
        }

        Promise.all(posts).then((posts_values) => {
            Promise.all(posts).then((exchanges_values) => {
                // console.log(days);
                // console.log(posts_values);
                // console.log(exchanges_values);
        
                res.send({
                    ok: true,
                    // date: dates,
                    days,
                    posts: posts_values,
                    exchanges: exchanges_values,
                    weeklyPosts,
                    weeklyExchanges,
                    monthlyPosts,
                    monthlyExchanges
                });
            });
        });
    } catch (err) {
        next(err);
    }
};
