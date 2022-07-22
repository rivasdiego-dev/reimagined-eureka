import React, { useState, useEffect } from 'react';
import './Complaint.css';
import {
  getReport,
  changeUserVisibility,
  deleteReport,
  changePostVisibility,
} from '../../../../services/AdminServices';

const Complaint = ({
  complaintId,
  token,
  setAlertModal,
  cleanAlert,
  setComplaintId,
  setIsComplaint,
  setIsComplaints,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState([]);
  const [user, setUser] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [reason, setReason] = useState('');
  const [isPost, setIsPost] = useState(false);
  const [isExchange, setIsExchange] = useState(false);

  useEffect(() => {
    const getSingleReport = async () => {
      const tempData = await getReport(complaintId);
      if (tempData.status === 200) {
        handleReport(tempData.data);
        handleUser(tempData.data);
        handleImage(tempData.data);
        setIsLoading(false);
      }
    };

    getSingleReport();
  }, [complaintId]);

  const handleReport = (data) => {
    setReason(data.report.reason);
    if (data.post) {
      setReport(data.post);
      setIsPost(true);
    } else if (data.exchange) {
      setReport(data.exchange);
      setIsExchange(true);
    }
  };

  const handleUser = (data) => {
    setUser(data.reported_user.username);
  };

  const handleImage = (data) => {
    if (data.post) {
      const tempImage = data.post.image.slice(8);
      console.log(tempImage);
      setImageUrl(`https://recycluster.social${tempImage}`);
    } else if (data.exchange) {
      const tempImage = data.exchange.image.slice(8);
      console.log(tempImage);
      setImageUrl(`https://recycluster.social${tempImage}`);
    }
  };

  const handleUserBan = async () => {
    const responseBan = await changeUserVisibility(token, user);
    if (responseBan.status === 200) {
      const responseDelete = await deleteReport(complaintId, token);
      if (responseDelete.status === 200) {
        setAlertModal({
          isAlert: true,
          message: 'The user has been banned',
          type: 'alert-error',
        });

        setTimeout(() => {
          cleanAlert();
        }, 3000);
        setIsComplaint(false);
        setIsComplaints(true);
        setComplaintId(null);
      }
    }
  };

  const handlePostBan = async () => {
    if (isPost) {
      const response = await changePostVisibility(token, complaintId);
      if (response.status === 200) {
        setAlertModal({
          isAlert: true,
          message: 'The user has been banned',
          type: 'alert-error',
        });

        setTimeout(() => {
          cleanAlert();
        }, 3000);
        setIsComplaint(false);
        setIsComplaints(true);
        setComplaintId(null);
      }
    }
  };

  return (
    <section className="complaint-container">
      {isLoading ? (
        ''
      ) : (
        <div className="complaint-card">
          <div className="complaint-title-container px-4">
            <p className="title">
              Individual complaint for complaint id: {complaintId}
            </p>
          </div>
          <div className="complaint-info-container px-4">
            <p className="title-text">Title</p>
            <p className="content-text">{report.title}</p>
            <p className="title-text">Image</p>
            <img
              src={imageUrl}
              alt="reported preview"
              className="image-preview"
            />
            <p className="title-text">Reported user</p>
            <p className="content-text">{user}</p>
            <p className="title-text">Reason</p>
            <p className="content-text">{reason}</p>
            <p className="title-text">Description</p>
            <p className="content-text">{report.description}</p>
            {isExchange ? (
              <>
                <p className="title-text">Materials</p>
                <p className="content-text">{report.materials}</p>
                <p className="title-text">Steps</p>
                <p className="content-text">{report.steps}</p>
              </>
            ) : (
              ''
            )}
          </div>
          <div className="buttons-container">
            <button
              className="button-structure remove-button"
              onClick={() => {
                handleUserBan();
              }}
            >
              Ban user
            </button>
            <button
              className="button-structure remove-button"
              onClick={() => {
                handlePostBan();
              }}
            >
              Ban post
            </button>
            <button
              className="button-structure dismiss-button"
              onClick={() => {
                setIsComplaint(false);
                setIsComplaints(true);
                setComplaintId(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Complaint;
