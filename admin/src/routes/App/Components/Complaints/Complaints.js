import React, { useState, useEffect } from 'react';
import './Complaints.css';
import { IoIosPaper } from 'react-icons/io';
import { getAllReports } from '../../../../services/AdminServices';

const Complaints = ({
  isComplaint,
  setIsComplaint,
  setIsComplaints,
  setComplaintId,
}) => {
  const [isLoading, setIsloading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [reports, setReports] = useState([]);
  let correlative = 0;

  useEffect(() => {
    const getReports = async () => {
      const tempData = await getAllReports(page);
      if (tempData.status === 200) {
        handleReports(tempData.data);
        handlePages(tempData.data);
        setIsloading(false);
      }
    };
    getReports();
  }, [page]);

  const handleReports = (data) => {
    setReports(data.reports);
  };

  const handlePages = (data) => {
    setPages([]);
    let tempPages = [];
    for (let i = 1; i <= data.pages; i++) {
      tempPages.push(i);
    }
    setPages(tempPages);
  };

  return (
    <div className="complaints-container">
      <div className="table-container">
        <div className="complaints-title-container px-4">
          <p className="title">Complaints on Recycluster</p>
        </div>
        <div className="complaints-table-container px-4">
          {isLoading ? (
            ''
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reason</th>
                  <th>Reporting user</th>
                  <th>Frequency</th>
                  <th>Creation date</th>
                  <th className="review-cell">Review</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  correlative += 1;

                  return (
                    <tr key={report.report.id}>
                      <th>{correlative}</th>
                      <th>{report.report.reason}</th>
                      <th>{report.user.username}</th>
                      <th>{report.report.frequency.length + 1}</th>
                      <th>
                        {report.report.createdAt.substring(
                          0,
                          report.report.createdAt.indexOf('T')
                        )}
                      </th>
                      <th className="button-cell">
                        <button
                          onClick={() => {
                            setIsComplaint(true);
                            setIsComplaints(false);
                            setComplaintId(report.report.id);
                          }}
                        >
                          <IoIosPaper />
                        </button>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="pagination-container my-4">
            {isLoading
              ? ''
              : pages.map((pageIndex) => {
                  return (
                    <button
                      key={pageIndex}
                      className={
                        pageIndex === page
                          ? 'pagination-item-active mx-1'
                          : 'pagination-item mx-1 '
                      }
                      onClick={() => {
                        setPage(pageIndex);
                      }}
                    >
                      {pageIndex}
                    </button>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
