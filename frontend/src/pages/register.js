import { useState } from "react";
import Layout from "../components/layout";
import { onRegistration } from "../api/auth";

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        blood_type: ''
    })

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const onSubmit = async (event) => {
        event.preventDefault()

        try {
            const { data } = await onRegistration(values)
            setError("")
            setSuccess(data.message)
            setValues({ username: '', email: '', password: '', blood_type: '' })
        } catch (error) {
            console.log(error.response.data.errors[0].msg)
            setError(error.response.data.errors[0].msg)
            setSuccess("")
        }
    }
    
    return (
    <Layout>
        <form onSubmit={(event) => onSubmit(event)} className='container mt-3'>
            <h1>Register</h1>

            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input 
                type="text" 
                className="form-control" 
                id="username" 
                name="username" 
                onChange={(event) => onChange(event)} 
                value={values.username}
                placeholder="Enter username"
                required
                />
            </div>
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
            <div className="mb-3">
                <label htmlFor="blood_type" className="form-label">Blood Type</label>
                <input 
                type="text" 
                className="form-control" 
                id="blood_type" 
                name="blood_type"
                onChange={(event) => onChange(event)}
                value={values.blood_type}
                placeholder="A, B, AB, O"
                required
                />
            </div>

            <div style={{ color: 'red', margin: '10px'}}>{error}</div>
            <div style={{ color: 'green', margin: '10px'}}>{success}</div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </Layout>
    )
}

export default Register;