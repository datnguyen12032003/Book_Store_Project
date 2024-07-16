import classNames from 'classnames/bind';
import styles from '../../styles/Login.module.scss';
import { getToken, setToken, setUserInfo } from './app/static';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import instance from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const cx = classNames.bind(styles);

function LoginUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLoginUser = async () => {
        var pattern = /[A-Z]/;
        const test = pattern.test(username);
        if (username === '' || password === '' || test === true) {
            setError('Email or password is invalid.');
        } else {
            try {
                const res = await instance.post('/users/login', { username, password });
                console.log('Login Response:', res.data);

                if (res.data) {
                    setToken(res.data);
                    setUserInfo(res.data);
                    console.log('user info:', res.data);
                    console.log('Token: ' + res.data);
                    navigate('/');
                    window.location.reload();
                } else {
                    throw new Error('Token not found in response.');
                }
            } catch (error) {
                console.error('Login failed:', error);
                toast.error('Failed to log in. Please check your credentials.');
            }
        }
    };

    return (
        <div className="h-[550px] font-times">
            <>
                <ToastContainer />
                <div className={cx('wrapper')}>
                    <div className={cx('inner')}>
                        <div className={cx('header-form-login')}>
                            <span>Đăng nhập</span>
                            <p>Nhập thông tin đăng nhập để tiếp tục</p>
                        </div>
                        <div className={cx('input-box')}>
                            <div className={cx('form-input')}>
                                <label>Tên đăng nhập </label>
                                <input placeholder="Tên đăng nhập" onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className={cx('form-input')}>
                                <label>Mật khẩu</label>
                                <input
                                    placeholder="Nhập mật khẩu"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className={cx('single-input-fields')}>
                                <div>
                                    <input type="checkbox" />
                                    <label>Giữ tôi đăng nhập</label>
                                </div>
                                <a href="/resetpassword">Quên mật khẩu?</a>
                            </div>
                        </div>
                        {error && <p className={cx('error-message')}>{error}</p>} {/* Hiển thị thông báo lỗi */}
                        <div className={cx('login-footer')}>
                            <p>
                                Chưa có tài khoản?{' '}
                                <Link id={cx('link')} to="/signup">
                                    Đăng ký
                                </Link>{' '}
                                tại đây
                            </p>
                            <button onClick={handleLoginUser}>Đăng nhập</button>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                className="flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={() => window.open('http://localhost:3000/api/users/google', '_self')}
                            >
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb3JJON85iCMGiuY2-fwef-kegI10la8ClXg&s"
                                    alt="Google Logo"
                                    className="w-5 h-5 mr-2"
                                />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default LoginUser;
