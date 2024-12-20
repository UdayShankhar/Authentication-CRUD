import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Input,
  Row,
  Checkbox,
  useInput,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function WelcomeScreen() {
  const { value, reset, bindings } = useInput("");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [OTPModal, setOTPModal] = useState(false);
  const [userIDValue, sethandleUserIDValue] = useState("");
  const [OTPValue, setOTPValue] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [signUpDetails, setSignUpDetails] = useState({});
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [openHelloModal, setOpenHelloModal] = useState(false);
  const [userIDOTP, setuserIDOTP] = useState({
    uniqueUserID: "",
    OTP: "",
  });

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const helper = React.useMemo(() => {
    if (!value)
      return {
        text: "",
        color: "",
      };
    const isValid = validateEmail(value);
    return {
      text: isValid ? "Correct email" : "Enter a valid email",
      color: isValid ? "success" : "error",
    };
  }, [value]);

  const openSignUpModal = () => {
    setVisible(true);
  };

  const openLoginModal = () => {
    setLoginModal(true);
  };

  const closeSignUpModal = () => {
    setVisible(false);
  };

  const SignUp = () => {
    let data = {
      username: userName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    };
    setSignUpDetails(data);
    axios
      .post("https://authentication-crud-8izu.onrender.com/api/auth/register", data)
      .then((res) => {
        console.log(res);
        setVisible(false);
        toast.success("Successfully created", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
        setOTPModal(true);
      })
      .catch((err) => {
        if (!userName || !email || !password) {
          toast("Please fill all the fields correctly", {
            position: "bottom-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        console.log(err);
      });
  };

  const Loginhandler = () => {
    setVisible(false);
    setLoginModal(true);
  };

  const Login = () => {
    let data = {
      emailAddress: loginEmail,
      password: loginPassword,
    };
    axios
      .post("https://authentication-crud-8izu.onrender.com/api/auth/login", data)
      .then((res) => {
        localStorage.setItem("jwt", `Bearer ${res.data.accessToken}`);
        localStorage.setItem("isAdmin", res.data.isAdmin);
        setLoginModal(false);
        setOpenHelloModal(true);
        setTimeout(() => {
          setOpenHelloModal(false);
          navigate("/user-list");
        }, 6800);
      })
      .catch((err) => {
        console.log(err);
        toast("Invalid Credentials", {
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

  const verifyOTP = () => {
    axios
      .post("https://authentication-crud-8izu.onrender.com/api/auth/verifyOTP", userIDOTP)
      .then((res) => {
        console.log(res);
        setVisible(false);
        toast.success("Success", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          // closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          setLoginModal(true);
        }, 1000);
      })
      .catch((err) => {
        if (!userName || !email || !password) {
          toast("Please fill all the fields correctly", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        console.log(err);
      });
  };

  const closeLoginModal = () => {
    setLoginModal(false);
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handlePhoneNumber = (e) => {
    setphoneNumber(e.target.value);
  };

  const handleUserIDValue = (e) => {
    sethandleUserIDValue(e.target.value);
  };

  const handleOTPValue = (e) => {
    setOTPValue(e.target.value);
  };

  const handleLoginUserName = (e) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPassword = (e) => {
    setLoginPassword(e.target.value);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        theme="dark"
      />
      <div className="container">
        <lottie-player
          src="https://assets4.lottiefiles.com/packages/lf20_1pxqjqps.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px", margin: "auto" }}
          loop
          autoplay
        ></lottie-player>
        <Text
          h2
          size={24}
          css={{
            color: "#37bdad",
          }}
          weight="bold"
          style={{ marginLeft: "14px" }}
        >
          Welcome to Secure Data Management & User Authentication Platform
        </Text>
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <Button auto className="letsGoBtn" onClick={openSignUpModal}>
            Sign Up
          </Button>

          <Button auto className="letsGoBtn" onClick={openLoginModal}>
            Sign In
          </Button>
        </div>
      </div>

      <Modal
        blur
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeSignUpModal}
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
            Welcome to
            <Text b size={18} style={{ marginLeft: "6px" }}>
              User List App
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
            placeholder="User Name"
            required
            onChange={handleUserName}
          />
          <Input
            clearable
            bordered
            fullWidth
            color="secondary"
            size="lg"
            placeholder="Email"
            required
            onChange={handleEmail}
          />
          <Input.Password
            bordered
            fullWidth
            color="secondary"
            size="lg"
            required
            type="password"
            placeholder="Password"
            onChange={handlePassword}
          />
          <Input
            bordered
            fullWidth
            size="lg"
            required
            color="secondary"
            type="number"
            placeholder="Phone Number"
            onChange={handlePhoneNumber}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto color="error" onClick={closeSignUpModal}>
            Close
          </Button>
          <Button auto color="secondary" onClick={SignUp}>
            {" "}
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal blur closeButton aria-labelledby="modal-title" open={OTPModal}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Verify OTP sent to your registered email
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            bordered
            fullWidth
            size="lg"
            required
            color="secondary"
            placeholder="Enter your unique UserID"
            onChange={(e) => {
              setuserIDOTP((prev) => ({
                ...prev,
                uniqueUserID: e.target.value,
              }));
            }}
          />
          <Input
            bordered
            fullWidth
            size="lg"
            required
            color="secondary"
            type="number"
            placeholder="Enter your OTP"
            onChange={(e) =>
              setuserIDOTP((prev) => ({ ...prev, OTP: e.target.value }))
            }
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <Button auto color="error" onClick={closeLoginModal}>
            Close
          </Button> */}
          <Button auto color="secondary" onClick={verifyOTP}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        blur
        closeButton
        aria-labelledby="modal-title"
        open={loginModal}
        onClose={closeLoginModal}
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
            Sign In Here
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="secondary"
            size="lg"
            placeholder="Email Address"
            aria-label="Email Address"
            onChange={handleLoginUserName}
          />
          <Input.Password
            bordered
            fullWidth
            color="secondary"
            size="lg"
            required
            type="password"
            placeholder="Password"
            aria-label="Password"
            onChange={handleLoginPassword}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto color="error" onClick={closeLoginModal}>
            Close
          </Button>
          <Button auto color="secondary" onClick={Login}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal blur aria-labelledby="modal-title" open={openHelloModal}>
        <Modal.Body>
          <lottie-player
            src="https://assets4.lottiefiles.com/packages/lf20_rbtawnwz.json"
            background="transparent"
            speed="1"
            style={{ width: "300px", height: "300px" }}
            autoplay
          ></lottie-player>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default WelcomeScreen;
