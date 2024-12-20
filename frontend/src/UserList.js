import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Text,
  Modal,
  Input,
  Row,
  Checkbox,
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserList.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";

function UserList() {
  const navigate = useNavigate();
  const [allData, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [latestData, setLatestData] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [openSignUpModal, setSignUpModal] = useState(false);
  const [editUserDetailsValue, setEditUserDetailsValue] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    id: "",
  });

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/");
    }
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api/users", {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        if (response.data?.data ?? response.data?.users) {
          setData(response.data?.data ?? response.data?.users ?? []);
        }
      });

    let data = {};
    let newData = allData.map((e, index) => {
      data = {
        key: index + 1,
        name: e.username,
        email: e.email,
      };
      return data;
    });
    setLatestData(newData);
  };

  const LogOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("editData");
    toast.success("Goodbye! You have logged out", {
      position: "bottom-center",
      autoClose: 1900,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const EditUser = (e) => {
    console.log(e);

    const { name, email, phoneNumber, _id } = e;
    setEditUserDetailsValue({
      name: name || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      id: _id || "",
    });
    localStorage.setItem("editData", e);
    handler();
  };

  const EditUserData = () => {
    let data = {
      name: editUserDetailsValue.name,
      email: editUserDetailsValue.email,
      phoneNumber: editUserDetailsValue.phoneNumber,
      id: editUserDetailsValue.id,
    };
    axios
      .put(`http://localhost:8000/api/users/updateUserDetails`, data, {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Successfully updated", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        fetchData();
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
        toast.warning("UserName already taken", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const DeleteUser = (e) => {
    axios
      .delete(`http://localhost:8000/api/users/find/${e}`, {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Successfully deleted", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditUserNameChange = (e) => {
    setEditUserName(e.target.value);
  };

  const SignUp = () => {
    let data = {
      username: userName,
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:8000/api/auth/register", data)
      .then((res) => {
        console.log(res);
        toast.success("New user added successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          progress: undefined,
          theme: "dark",
        });
        setSignUpModal(false);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        toast.warning("User Name and Email should be unique", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const addUser = () => {
    const token = localStorage.getItem("jwt");

    // if (!token) {
    //   toast.error("You are not authenticated", {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     progress: undefined,
    //     theme: "dark",
    //   });
    //   return;
    // }

    // Prepare the new user's data
    const newUser = {
      name: userName, // Use 'name' to match the backend API field
      email: email,
      ...(phoneNumber && { phoneNumber }),
    };

    // Make the API request
    axios
      .post("http://localhost:8000/api/users/create-user", newUser, {
        headers: {
          Authorization: `${token}`, // Include token in request headers
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("New user added successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          progress: undefined,
          theme: "dark",
        });

        fetchData();
        closeSignModal();
      })
      .catch((err) => {
        console.error(err);

        // Handle errors gracefully
        const errorMessage =
          err.response?.data?.message ||
          "Failed to add user. Please try again.";
        toast.error(errorMessage, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          progress: undefined,
          theme: "dark",
        });

        // Optional: Handle specific error codes
        if (err.response?.status === 401) {
          toast.error("Your session has expired. Please log in again.", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            progress: undefined,
            theme: "dark",
          });
          localStorage.removeItem("authToken");
        }
      });
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumber = (e) => {
    setphoneNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const openSModal = () => setSignUpModal(true);

  const closeSignModal = () => setSignUpModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetailsValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        theme="dark"
      />

      <Button
        color="success"
        auto
        onClick={openSModal}
        style={{ position: "fixed", right: "8rem", top: "0.6rem" }}
      >
        Add User
      </Button>

      <Button
        color="error"
        auto
        onClick={LogOut}
        style={{ position: "fixed", right: "1rem", top: "0.6rem" }}
      >
        Log Out
      </Button>

      {allData.length > 0 ? (
        <div>
          <Text
            h1
            size={50}
            css={{
              textGradient: "45deg, $purple600 -20%, $pink600 100%",
              margin: "60px",
              textAlign: "center",
            }}
            weight="bold"
            className="appName"
          >
            PeopleHub
          </Text>
          <table className="mainTable">
            <thead>
              <tr>
                <th
                  style={{
                    color: " #cd88d6",
                    fontSize: "30px",
                  }}
                >
                  UserName
                </th>
                <th
                  style={{
                    color: " #cd88d6",
                    fontSize: "30px",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    color: " #cd88d6",
                    fontSize: "30px",
                  }}
                >
                  Phone Number
                </th>
                <th
                  style={{
                    color: " #cd88d6",
                    fontSize: "30px",
                  }}
                >
                  Edit User
                </th>
                <th
                  style={{
                    color: " #cd88d6",
                    fontSize: "30px",
                  }}
                >
                  Delete User
                </th>
              </tr>
            </thead>
            <tbody>
              {allData.map((e, index) => (
                <tr key={index}>
                  <td>{e.username || e.name || ""}</td>
                  <td>{e.email || ""}</td>
                  <td>{e?.phoneNumber || ""}</td>
                  <td onClick={() => EditUser(e)} style={{ cursor: "pointer" }}>
                    <EditIcon />
                  </td>
                  <td
                    onClick={() => DeleteUser(e._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <DeleteIcon />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="parent-div-no-data">
        <div className="card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 122.25"
            y="0px"
            x="0px"
            id="cookieSvg"
            version="1.1"
          >
            <g>
              <path d="M101.77,49.38c2.09,3.1,4.37,5.11,6.86,5.78c2.45,0.66,5.32,0.06,8.7-2.01c1.36-0.84,3.14-0.41,3.97,0.95 c0.28,0.46,0.42,0.96,0.43,1.47c0.13,1.4,0.21,2.82,0.24,4.26c0.03,1.46,0.02,2.91-0.05,4.35h0v0c0,0.13-0.01,0.26-0.03,0.38 c-0.91,16.72-8.47,31.51-20,41.93c-11.55,10.44-27.06,16.49-43.82,15.69v0.01h0c-0.13,0-0.26-0.01-0.38-0.03 c-16.72-0.91-31.51-8.47-41.93-20C5.31,90.61-0.73,75.1,0.07,58.34H0.07v0c0-0.13,0.01-0.26,0.03-0.38 C1,41.22,8.81,26.35,20.57,15.87C32.34,5.37,48.09-0.73,64.85,0.07V0.07h0c1.6,0,2.89,1.29,2.89,2.89c0,0.4-0.08,0.78-0.23,1.12 c-1.17,3.81-1.25,7.34-0.27,10.14c0.89,2.54,2.7,4.51,5.41,5.52c1.44,0.54,2.2,2.1,1.74,3.55l0.01,0 c-1.83,5.89-1.87,11.08-0.52,15.26c0.82,2.53,2.14,4.69,3.88,6.4c1.74,1.72,3.9,3,6.39,3.78c4.04,1.26,8.94,1.18,14.31-0.55 C99.73,47.78,101.08,48.3,101.77,49.38L101.77,49.38z M59.28,57.86c2.77,0,5.01,2.24,5.01,5.01c0,2.77-2.24,5.01-5.01,5.01 c-2.77,0-5.01-2.24-5.01-5.01C54.27,60.1,56.52,57.86,59.28,57.86L59.28,57.86z M37.56,78.49c3.37,0,6.11,2.73,6.11,6.11 s-2.73,6.11-6.11,6.11s-6.11-2.73-6.11-6.11S34.18,78.49,37.56,78.49L37.56,78.49z M50.72,31.75c2.65,0,4.79,2.14,4.79,4.79 c0,2.65-2.14,4.79-4.79,4.79c-2.65,0-4.79-2.14-4.79-4.79C45.93,33.89,48.08,31.75,50.72,31.75L50.72,31.75z M119.3,32.4 c1.98,0,3.58,1.6,3.58,3.58c0,1.98-1.6,3.58-3.58,3.58s-3.58-1.6-3.58-3.58C115.71,34.01,117.32,32.4,119.3,32.4L119.3,32.4z M93.62,22.91c2.98,0,5.39,2.41,5.39,5.39c0,2.98-2.41,5.39-5.39,5.39c-2.98,0-5.39-2.41-5.39-5.39 C88.23,25.33,90.64,22.91,93.62,22.91L93.62,22.91z M97.79,0.59c3.19,0,5.78,2.59,5.78,5.78c0,3.19-2.59,5.78-5.78,5.78 c-3.19,0-5.78-2.59-5.78-5.78C92.02,3.17,94.6,0.59,97.79,0.59L97.79,0.59z M76.73,80.63c4.43,0,8.03,3.59,8.03,8.03 c0,4.43-3.59,8.03-8.03,8.03s-8.03-3.59-8.03-8.03C68.7,84.22,72.29,80.63,76.73,80.63L76.73,80.63z M31.91,46.78 c4.8,0,8.69,3.89,8.69,8.69c0,4.8-3.89,8.69-8.69,8.69s-8.69-3.89-8.69-8.69C23.22,50.68,27.11,46.78,31.91,46.78L31.91,46.78z M107.13,60.74c-3.39-0.91-6.35-3.14-8.95-6.48c-5.78,1.52-11.16,1.41-15.76-0.02c-3.37-1.05-6.32-2.81-8.71-5.18 c-2.39-2.37-4.21-5.32-5.32-8.75c-1.51-4.66-1.69-10.2-0.18-16.32c-3.1-1.8-5.25-4.53-6.42-7.88c-1.06-3.05-1.28-6.59-0.61-10.35 C47.27,5.95,34.3,11.36,24.41,20.18C13.74,29.69,6.66,43.15,5.84,58.29l0,0.05v0h0l-0.01,0.13v0C5.07,73.72,10.55,87.82,20.02,98.3 c9.44,10.44,22.84,17.29,38,18.1l0.05,0h0v0l0.13,0.01h0c15.24,0.77,29.35-4.71,39.83-14.19c10.44-9.44,17.29-22.84,18.1-38l0-0.05 v0h0l0.01-0.13v0c0.07-1.34,0.09-2.64,0.06-3.91C112.98,61.34,109.96,61.51,107.13,60.74L107.13,60.74z M116.15,64.04L116.15,64.04 L116.15,64.04L116.15,64.04z M58.21,116.42L58.21,116.42L58.21,116.42L58.21,116.42z"></path>
            </g>
          </svg>
          <p className="cookieHeading">Thanks for choosing our app!</p>
          <p className="cookieDescription">
            Please create your data here <br />
          
          </p>

          <div className="buttonContainer">
            {/* <button className="acceptButton" onClick={openSModal}>
              Add
            </button> */}
            <Button auto color="success" onClick={openSModal}>
              {" "}
              Add User
            </Button>
          </div>
        </div>
        </div>
      )}
      <div>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            rtl={false}
            theme="dark"
          />
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Edit User Details
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              bordered
              fullWidth
              color="primary"
              size="lg"
              name="name"
              value={editUserDetailsValue.name}
              onChange={handleInputChange}
            />
            <Input
              bordered
              fullWidth
              color="primary"
              size="lg"
              name="email"
              value={editUserDetailsValue.email}
              onChange={handleInputChange}
            />
            <Input
              bordered
              fullWidth
              color="primary"
              size="lg"
              name="phoneNumber"
              value={editUserDetailsValue.phoneNumber}
              onChange={handleInputChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button auto onClick={EditUserData}>
              Edit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div>
        <Modal
          blur
          closeButton
          aria-labelledby="modal-title"
          open={openSignUpModal}
          onClose={closeSignModal}
        >
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            rtl={false}
            theme="dark"
          />
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Add
              <Text b size={18} style={{ marginLeft: "6px" }}>
                User
              </Text>
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="secondary"
              size="lg"
              placeholder="Name"
              onChange={handleUserName}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="secondary"
              size="lg"
              placeholder="Email Address"
              onChange={handleEmail}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="secondary"
              size="lg"
              placeholder="Phone Number"
              onChange={handlePhoneNumber}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button auto color="error" onClick={closeSignModal}>
              Close
            </Button>
            <Button auto color="secondary" onClick={addUser}>
              {" "}
              Add User
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default UserList;
