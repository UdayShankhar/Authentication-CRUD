import React, { useEffect, useState } from 'react'
import { Table, Button, Text, Modal, Input, Row, Checkbox } from "@nextui-org/react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./UserList.css"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

function UserList() {
    const navigate = useNavigate();
    const [allData, setData] = useState([])
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [latestData, setLatestData] = useState([])
    const [visible, setVisible] = React.useState(false);
    const [editUserName, setEditUserName] = useState('')
    const [openSignUpModal, setSignUpModal] = useState(false)

    const handler = () => setVisible(true);

    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    useEffect(() => {
        if (!localStorage.getItem('jwt')) {
            navigate('/')
        }
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get("http://localhost:8000/api/users", {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('jwt')
            }
        })
            .then((response) => {
                console.log(response.data.users)
                setData(response.data.users)
            })
            .catch((err) => { console.log(err) })

        let data = {}
        let newData = allData.map((e, index) => {
            data = {
                'key': index + 1,
                'name': e.username,
                'email': e.email
            }
            return data
        })
        setLatestData(newData)
        console.log(newData);
    }

    const LogOut = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('editData')
        navigate('/')
    }

    const EditUser = (e) => {
        localStorage.setItem('editData', e)
        handler()
    }

    const EditUserData = () => {
        let data = {
            'username': editUserName
        }
        axios.put(`http://localhost:8000/api/users/${localStorage.getItem('editData')}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('jwt')
            }
        }).then((res) => {
            console.log(res);
            toast.success('Successfully updated', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            fetchData()
            setVisible(false)
        }).catch((err) => {
            console.log(err);
            toast.warning('UserName already taken', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        })
    }

    const DeleteUser = (e) => {
        axios.delete(`http://localhost:8000/api/users/find/${e}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('jwt')
            }
        })
            .then((res) => {
                console.log(res);
                toast.success('Successfully deleted', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                fetchData()
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleEditUserNameChange = (e) => {
        setEditUserName(e.target.value)
    }

    const SignUp = () => {
        let data = {
            "username": userName,
            "email": email,
            "password": password
        }
        axios.post("http://localhost:8000/api/auth/register", data)
            .then((res) => {
                console.log(res);
                toast.success('New user added successfully', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    progress: undefined,
                    theme: "dark",
                });
                setSignUpModal(false)
                fetchData()
            }).catch((err) => {
                console.log(err);
                toast.warning('User Name and Email should be unique', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    progress: undefined,
                    theme: "dark",
                });
            })
    }

    const handleUserName = (e) => {
        setUserName(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const openSModal = () => setSignUpModal(true)

    const closeSignModal = () => setSignUpModal(false)

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

            <Button color="success" auto onClick={openSModal} style={{ position: 'fixed', right: '8rem', top: '0.6rem' }}>
                Add User
            </Button>

            <Button color="error" auto onClick={LogOut} style={{ position: 'fixed', right: '1rem', top: '0.6rem' }}>
                Log Out
            </Button>

            <div>
                <Text
                    h1
                    size={50}
                    css={{
                        textGradient: "45deg, $purple600 -20%, $pink600 100%",
                        margin: '60px',
                        textAlign: 'center',
                    }}
                    weight="bold"
                    className='appName'
                >
                    User List App
                </Text>
                <table className='mainTable'>
                    <tr>
                        <th style={{
                            color: ' #cd88d6',
                            fontSize: '30px'
                        }} >UserName</th>
                        <th
                            style={{
                                color: ' #cd88d6',
                                fontSize: '30px'
                            }}>Email</th>
                        <th style={{
                            color: ' #cd88d6',
                            fontSize: '30px'
                        }}>Edit User</th>
                        <th style={{
                            color: ' #cd88d6',
                            fontSize: '30px'
                        }}>Delete User</th>
                    </tr>
                    {allData.map((e, index) => (
                        <tr key={index}>
                            <td> {e.username} </td>
                            <td> {e.email} </td>
                            <td onClick={() => EditUser(e._id)} style={{ cursor: 'pointer' }}><EditIcon /></td>
                            <td onClick={() => DeleteUser(e._id)} style={{ cursor: 'pointer' }}><DeleteIcon /></td>
                        </tr>
                    ))}
                </table>
            </div>

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
                            Edit User Name
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Input
                            clearable
                            bordered
                            fullWidth
                            color="primary"
                            size="lg"
                            placeholder="User Name"
                            onChange={handleEditUserNameChange}
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
                            <Text b size={18} style={{ marginLeft: '6px' }}>
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
                            placeholder="User Name"
                            onChange={handleUserName}
                        />
                        <Input
                            clearable
                            bordered
                            fullWidth
                            color="secondary"
                            size="lg"
                            placeholder="Email"
                            onChange={handleEmail}
                        />
                        <Input.Password
                            bordered
                            fullWidth
                            color="secondary"
                            size="lg"
                            required
                            type='password'
                            placeholder="Password"
                            onChange={handlePassword}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto color="error" onClick={closeSignModal}>
                            Close
                        </Button>
                        <Button auto color="secondary" onClick={SignUp} > Add User
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default UserList