import './App.css';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import Stats from '../Components/Stats/Stats';
import { useState, useEffect } from 'react';
import Users from '../Components/Users/Users';
import Complaints from '../Components/Complaints/Complaints';
import Complaint from '../Components/Complaint/Complaint';

function App() {
  const [isStats, setIsStats] = useState(true);
  const [isComplaints, setIsComplaints] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isComplaint, setIsComplaint] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogout, setIsLogout] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isAlert: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
  }, []);

  const cleanAlert = () => {
    setAlertModal({ isAlert: false, message: '', type: '' });
  };

  return (
    <div className="app">
      {alertModal.isAlert ? (
        <div className={`alert-modal ${alertModal.type}`}>
          <div className="alert-blank"></div>
          <p>{alertModal.message}</p>
          <button
            className="alert-button"
            onClick={() => {
              cleanAlert();
            }}
          >
            <IoIosClose />
          </button>
        </div>
      ) : (
        ''
      )}
      <header className="app-header px-6">
        <p>Recycluster</p>
        <button
          onClick={() => {
            setIsLogout(true);
          }}
        >
          <IoIosArrowDown />
        </button>
        {isLogout ? (
          <div className="logout-container">
            <div className="logout-title-container">
              <p className="logout-title">Logout?</p>
            </div>
            <div className="logout-button-container">
              <button
                className="logout-button"
                onClick={() => {
                  window.localStorage.removeItem('token');
                  window.location.reload();
                }}
              >
                Yes
              </button>
              <button
                className="logout-button"
                onClick={() => {
                  setIsLogout(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
      </header>
      <div className="main">
        <nav className="app-nav px-6">
          <button
            className={isStats ? 'nav-item-active my-2' : 'nav-item my-2'}
            onClick={() => {
              setIsStats(true);
              setIsComplaints(false);
              setIsComplaint(false);
              setComplaintId(null);
              setIsUsers(false);
            }}
          >
            Stats
          </button>
          <button
            className={
              isComplaints | isComplaint
                ? 'nav-item-active my-2'
                : 'nav-item my-2'
            }
            onClick={() => {
              setIsStats(false);
              setIsComplaints(true);
              setIsComplaint(false);
              setComplaintId(null);
              setIsUsers(false);
            }}
          >
            Complaints
          </button>
          <button
            className={isUsers ? 'nav-item-active my-2' : 'nav-item my-2'}
            onClick={() => {
              setIsStats(false);
              setIsComplaints(false);
              setIsComplaint(false);
              setComplaintId(null);
              setIsUsers(true);
            }}
          >
            Users
          </button>
        </nav>
        <div className="content">
          {isStats ? <Stats token={token} /> : ''}
          {isComplaints ? (
            <Complaints
              isComplaint={isComplaint}
              setIsComplaint={setIsComplaint}
              setIsComplaints={setIsComplaints}
              setComplaintId={setComplaintId}
            />
          ) : (
            ''
          )}
          {isComplaint ? (
            <Complaint
              complaintId={complaintId}
              token={token}
              setAlertModal={setAlertModal}
              cleanAlert={cleanAlert}
              setComplaintId={setComplaintId}
              setIsComplaint={setIsComplaint}
              setIsComplaints={setIsComplaints}
            />
          ) : (
            ''
          )}
          {isUsers ? (
            <Users
              token={token}
              setAlertModal={setAlertModal}
              cleanAlert={cleanAlert}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      {/* <button
        onClick={() => {
          createUser(
            'acostam3315',
            'acostam3315@gmail.com',
            '1234-5678',
            'Secreto1'
          );
        }}
      >
        nuevo usuario
      </button> */}
    </div>
  );
}

export default App;
