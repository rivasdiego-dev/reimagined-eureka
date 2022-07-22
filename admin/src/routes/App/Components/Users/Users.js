import React, { useEffect } from 'react';
import { IoIosSearch, IoIosKey } from 'react-icons/io';
import { FaBan } from 'react-icons/fa';
import {
  changeUserVisibility,
  getUser,
  getUsers,
  restorePassword,
} from '../../../../services/AdminServices';
import './Users.css';
import { useState } from 'react';

const Users = ({ token, setAlertModal, cleanAlert }) => {
  // const tableInfo = [
  //   {
  //     id: 1,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 2,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 3,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 4,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 5,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 6,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 7,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 8,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 9,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  //   {
  //     id: 10,
  //     username: 'acostam331',
  //     email: 'acostam331@gmail.com',
  //     phone: '+503 7657 5652',
  //     points: 600,
  //   },
  // ];
  const [isLoading, setIsloading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [search, setSearch] = useState('');
  let correlative = 0;

  useEffect(() => {
    const getAllUsers = async () => {
      const tempData = await getUsers(token, page);
      if (tempData.status === 200) {
        handleUsers(tempData.data);
        handlePages(tempData.data);
        setIsloading(false);
      }
    };
    getAllUsers();
  }, [token, page]);

  const handleUsers = (data) => {
    setUsers(data.users);
  };

  const handlePages = (data) => {
    setPages([]);
    let tempPages = [];
    for (let i = 1; i <= data.pages; i++) {
      tempPages.push(i);
    }

    setPages(tempPages);
  };

  const handleBan = async (id, username) => {
    const response = await changeUserVisibility(token, username);
    let newUsers = [];
    if (response.status === 200) {
      newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
      setAlertModal({
        isAlert: true,
        message: 'The user has been banned',
        type: 'alert-error',
      });

      setTimeout(() => {
        cleanAlert();
      }, 3000);
    }
  };

  const handleRestore = async (email) => {
    const response = await restorePassword(email);
    if (response.status === 200) {
      setAlertModal({
        isAlert: true,
        message: 'The password has been restored',
        type: 'alert-success',
      });

      setTimeout(() => {
        cleanAlert();
      }, 3000);
    }
  };

  const handleSearch = async (username) => {
    let newUser = [];
    if (username !== '') {
      newUser = await getUser(username);
      if (newUser.status === 200) {
        setUsers([newUser.data.user]);
      }
    } else {
      setPage(1);
      newUser = await getUsers(token, page);
      handleUsers(newUser.data);
    }
  };

  return (
    <section className="users-container">
      <div className="table-container">
        <div className="users-title-container px-4">
          <p className="title">Users on Recycluster</p>
          <div className="search-container">
            <input
              type="text"
              className="search-input px-4"
              placeholder="Search by username"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                console.log(search);
              }}
            />
            <button
              className="search-button"
              onClick={() => {
                handleSearch(search);
              }}
            >
              <IoIosSearch className="search-icon" />
            </button>
          </div>
        </div>
        <div className="users-table-container px-4">
          {isLoading ? (
            ''
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>email</th>
                  <th>Phone</th>
                  <th>Points</th>
                  <th className="ban-cell">Ban</th>
                  <th className="restore-cell">Restore</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? ''
                  : users.map((user) => {
                      const { id, username, email, phone, points } = user;

                      correlative += 1;

                      return (
                        <tr key={id}>
                          <th>{correlative}</th>
                          <th>{username}</th>
                          <th>{email}</th>
                          <th>{phone}</th>
                          <th>{points}</th>
                          <th className="button-cell">
                            <button
                              onClick={() => {
                                handleBan(id, username);
                              }}
                            >
                              <FaBan />
                            </button>
                          </th>
                          <th className="button-cell">
                            <button
                              onClick={() => {
                                handleRestore(email);
                              }}
                            >
                              <IoIosKey />
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
    </section>
  );
};

export default Users;
