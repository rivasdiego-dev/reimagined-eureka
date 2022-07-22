import React, { useState, useEffect } from 'react';
import Chart from '../Chart/Chart';
import { getStats } from '../../../../services/AdminServices';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Stats.css';

const Stats = ({ token }) => {
  const [titles, setTitles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [gridStats, setGridStats] = useState({});
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const getData = async () => {
      const tempData = await getStats(token);
      if (tempData.status === 200) {
        handleStats(tempData.data);
        setIsLoading(false);
      }
    };
    getData();
  }, [token]);

  const handleStats = (stats) => {
    setPosts(stats.posts.slice(-5).reverse());
    setExchanges(stats.exchanges.slice(-5).reverse());
    setTitles(stats.days.slice(-5).reverse());
    setGridStats([
      stats.posts[0],
      stats.weeklyPosts,
      stats.monthlyPosts,
      stats.exchanges[0],
      stats.weeklyExchanges,
      stats.monthlyExchanges,
    ]);
  };

  return (
    <section className="stats">
      <div className="stats-element">
        <div className="stats-element-grid py-6">
          {isLoading ? (
            ''
          ) : (
            <>
              <div className="grid-element">
                <p className="grid-element-item">Daily posts</p>
                <p className="grid-element-item grid-number">{gridStats[0]}</p>
              </div>
              <div className="grid-element">
                <p className="grid-element-item">Weekly posts</p>
                <p className="grid-element-item grid-number">{gridStats[1]}</p>
              </div>
              <div className="grid-element">
                <p className="grid-element-item">Monthly posts</p>
                <p className="grid-element-item grid-number">{gridStats[2]}</p>
              </div>
              <div className="grid-element">
                <p className="grid-element-item">Daily Exchanges</p>
                <p className="grid-element-item grid-number">{gridStats[3]}</p>
              </div>
              <div className="grid-element">
                <p className="grid-element-item">weekly Exchanges</p>
                <p className="grid-element-item grid-number">{gridStats[4]}</p>
              </div>
              <div className="grid-element">
                <p className="grid-element-item">Monthly Exchanges</p>
                <p className="grid-element-item grid-number">{gridStats[5]}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="stats-element">
        <div className="chart-element charts">
          {isLoading ? (
            ''
          ) : (
            <Chart
              token={token}
              posts={posts}
              exchanges={exchanges}
              titles={titles}
            />
          )}
        </div>
        <div className="chart-element">
          <div className="calendar-container">
            {isLoading ? '' : <Calendar onChange={setDate} value={date} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
