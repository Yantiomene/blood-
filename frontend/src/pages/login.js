import { useState } from "react";
import Layout from "../components/layout";
import { onLogin } from "../api/auth";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../redux/slices/authSlice";

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const [error, setError] = useState(false)

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const dispatch = useDispatch()
    const onSubmit = async (event) => {
        event.preventDefault()

        try {
            await onLogin(values)
            dispatch(authenticateUser())
            localStorage.setItem('isAuth', true)
            setError("")
        } catch (error) {
            console.log(error.response.data.errors[0].msg)
            setError(error.response.data.errors[0].msg)
        }

    }
    
    return (
    <Layout>
        <form onSubmit={(event) => onSubmit(event)} className='container mt-3'>
            <h1>Login</h1>
           
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email" 
                onChange={(event) => onChange(event)} 
                value={values.email}
                placeholder="Enter email"
                required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password" 
                onChange={(event) => onChange(event)} 
                value={values.password}
                placeholder="Enter password"
                required
                />
            </div>

            <div style={{ color: 'red', margin: '10px'}}>{error}</div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </Layout>
    )
}

export default Login;