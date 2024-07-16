import classNames from 'classnames/bind';
import styles from '../../styles/Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const cx = classNames.bind(styles);

function RegisterUser() {
    const [fullname, setFullname] = useState(''); // Tạo state để lưu fullname
    const [email, setEmail] = useState(''); // Tạo state để lưu email
    const [password, setPassword] = useState(''); // Tạo state để lưu password
    const [phone, setPhone] = useState(''); // Tạo state để lưu phone
    const [address, setAddress] = useState(''); // T
    const [username, setUsername] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const handleRegister = async () => {
        // Hàm xử lý đăng ký
        try {
            // Thực hiện đăng ký
            var pattern = /[A-Z]/; // Kiểm tra xem chuỗi có chứa ký tự viết hoa hay không
            const phonePattern = /^0\d{9,10}$/;
            const patternUpperCase = /[A-Z]/;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkPhone = phonePattern.test(phone);
            const checkEmailUpperCase = patternUpperCase.test(email);
            const checkEmailSyntax = emailPattern.test(email);

            if (fullname === '' || email === '' || password === '' || phone === '') {
                // Kiểm tra xem fullname, email, password, confirmPassword
                toast.error('Vui Lòng Xem Lại Thông Tin !!!');
            } else if (checkEmailUpperCase === true) {
                // Kiểm tra xem email có chứa ký tự viết hoa không
                toast.error('Email Không Được Viết Hoa !!!');
            } else if (!checkEmailSyntax) {
                // Kiểm tra cú pháp email
                toast.error('Email Không Hợp Lệ !!!');
            } else if (!checkPhone) {
                // Kiểm tra tính hợp lệ của số điện thoại
                toast.error('Số Điện Thoại Không Hợp Lệ !!!');
            } else {
                // Nếu đăng ký thành công
                const res = await instance.post('/users/signup', {
                    // Thực hiện đăng ký
                    fullname,
                    email,
                    password,
                    username,
                    phone,
                    address,
                }); // Gửi yêu cầu đăng ký đến server
                // toast.success(res.data.message); // Hiển thị thông báo thành công
                alert('Your account has been successfully registered, please log in');
                navigate('/login');
            }
        } catch (error) {
            // // Nếu đăng ký thất bại
            // toast.error(error.response.data.message); // Hiển thị thông báo lỗi
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 409) {
                    // HTTP status 409 means conflict (e.g., duplicate username or email)
                    toast.error(error.response.data.message);
                }
                if (error.response.status === 500) {
                    // HTTP status 409 means conflict (e.g., duplicate username or email)
                    toast.error('Username or email already exists');
                } else {
                    // Other server errors
                    toast.error('An error occurred. Please try again later.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an error
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="h-[850px] font-times">
            <>
                <ToastContainer />
                <div className={cx('wrapper-signup')}>
                    <div className={cx('inner')}>
                        <div className={cx('header-form-login')}>
                            <span>Sign Up</span>
                            <p>Create your account to get full access</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>UserName</label>
                                <input placeholder="Enter User Name" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Full Name</label>
                                <input placeholder="Enter Full Name" onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Email Address</label>
                                <input placeholder="Enter Email Address" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Phone</label>
                                <input
                                    placeholder="Enter Telephone Number"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className={cx('form-input')}>
                                <label>Address</label>
                                <input placeholder="Enter Your Address" onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Password</label>

                                <input
                                    placeholder="Enter Password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('login-footer')}>
                            <p>
                                Already have an account?&nbsp;
                                <Link id={cx('link')} to="/login">
                                    Login
                                </Link>
                                &nbsp;here
                            </p>
                            <button onClick={handleRegister}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default RegisterUser;
